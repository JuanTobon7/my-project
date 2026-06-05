// services/camundaService.js

const CAMUNDA_ENGINE = "http://localhost:8080/api/engine-rest";
export const WORKER_ID = "react-frontend-worker";

// ─────────────────────────────────────────────
// PROCESO
// ─────────────────────────────────────────────

export async function startRegisterProcess(variables = {}) {
  const response = await fetch(
    `${CAMUNDA_ENGINE}/process-definition/key/pqr_great_parent/start`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variables })
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Error al iniciar proceso: ${response.status} — ${JSON.stringify(error)}`);
  }
  return await response.json();
}

// ─────────────────────────────────────────────
// FETCH & LOCK
// ─────────────────────────────────────────────

export async function fetchAndLockTask(topic, lockDuration = 60000) {
  const response = await fetch(
    `${CAMUNDA_ENGINE}/external-task/fetchAndLock`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerId: WORKER_ID,
        maxTasks: 1,
        usePriority: false,
        topics: [{ topicName: topic, lockDuration }]
      })
    }
  );
  if (!response.ok) throw new Error(`Error en fetchAndLock: ${response.status}`);
  const tasks = await response.json();
  return tasks.length > 0 ? tasks[0] : null;
}

export async function pollForTask(
  topic,
  { intervalMs = 2000, timeoutMs = 300_000, lockDuration = 60000 } = {}
) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        if (Date.now() > deadline) {
          clearInterval(interval);
          reject(new Error(`Timeout esperando tarea del topic "${topic}"`));
          return;
        }
        const task = await fetchAndLockTask(topic, lockDuration);
        if (task) { clearInterval(interval); resolve(task); }
      } catch (err) { clearInterval(interval); reject(err); }
    }, intervalMs);
  });
}

// ─────────────────────────────────────────────
// COMPLETE — datos de persona
// ─────────────────────────────────────────────

export async function completeExternalTask(taskId, personData) {
  const response = await fetch(
    `${CAMUNDA_ENGINE}/external-task/${taskId}/complete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerId: WORKER_ID,
        variables: {
          personName:     { value: personData.personName,             type: "String" },
          personLastName: { value: personData.personLastName,         type: "String" },
          numberPhone:    { value: personData.numberPhone.toString(), type: "String" },
          email:          { value: personData.email,                  type: "String" }
        }
      })
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Error al completar tarea ${taskId}: ${JSON.stringify(error)}`);
  }
  return true;
}

// ─────────────────────────────────────────────
// COMPLETE — datos de visita
// topic: receive_data_visit
// variables: date_visit (String), employement_phone (String)
// ─────────────────────────────────────────────

export async function completeVisitTask(taskId, dateVisit, employementPhone) {
  const response = await fetch(
    `${CAMUNDA_ENGINE}/external-task/${taskId}/complete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerId: WORKER_ID,
        variables: {
          date_visit:        { value: String(dateVisit),        type: "String" },
          employement_phone: { value: String(employementPhone), type: "String" }
        }
      })
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Error al completar visita ${taskId}: ${JSON.stringify(error)}`);
  }
  return true;
}

// ─────────────────────────────────────────────
// FAILURE
// ─────────────────────────────────────────────

export async function reportTaskFailure(taskId, errorMessage, retries = 2, retryTimeout = 5000) {
  const response = await fetch(
    `${CAMUNDA_ENGINE}/external-task/${taskId}/failure`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId: WORKER_ID, errorMessage, retries, retryTimeout })
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error(`No se pudo reportar fallo de tarea ${taskId}:`, JSON.stringify(error));
  }
}

// ─────────────────────────────────────────────
// FLUJO COMPLETO — registro de persona
// ─────────────────────────────────────────────

export async function runRegisterFlow(personData) {
  const instance = await startRegisterProcess();
  console.log("Proceso iniciado:", instance.id);

  let task;
  try {
    task = await pollForTask("receive-person-data", {
      intervalMs: 2000, timeoutMs: 300_000, lockDuration: 60000
    });
  } catch (err) {
    throw new Error(`No se encontró la tarea: ${err.message}`);
  }

  try {
    await completeExternalTask(task.id, personData);
    console.log("Tarea completada correctamente.");
  } catch (err) {
    await reportTaskFailure(task.id, err.message);
    throw err;
  }

  return instance;
}

// ─────────────────────────────────────────────
// FLUJO COMPLETO — asignación de visita
// Puede llamarse desde PqrList o EmploymentList
// ─────────────────────────────────────────────

export async function runVisitAssignFlow(dateVisit, employementPhone) {
  let task;
  try {
    task = await pollForTask("receive_data_visit", {
      intervalMs: 2000, timeoutMs: 300_000, lockDuration: 60000
    });
  } catch (err) {
    throw new Error(`No se encontró la tarea de visita: ${err.message}`);
  }

  console.log("Tarea de visita obtenida:", task.id);

  try {
    await completeVisitTask(task.id, dateVisit, employementPhone);
    console.log("Visita asignada correctamente.");
  } catch (err) {
    await reportTaskFailure(task.id, err.message);
    throw err;
  }

  return task;
}
