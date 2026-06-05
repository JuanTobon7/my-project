// services/camundaService.js

const CAMUNDA_ENGINE = "http://localhost:8080/api/engine-rest";
export const WORKER_ID = "react-frontend-worker";

// ─────────────────────────────────────────────
// PROCESO
// ─────────────────────────────────────────────

/**
 * Arranca el proceso PADRE (el que contiene la Call Activity).
 * El proceso padre a su vez instancia store_people_in_crm automáticamente.
 * Reemplaza PARENT_PROCESS_KEY con el key real de tu proceso padre.
 */
export async function startRegisterProcess(variables = {}) {
  const response = await fetch(
    `${CAMUNDA_ENGINE}/process-definition/key/process_pqr_ambient/start`,
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

/**
 * Intento único de fetchAndLock.
 * Devuelve la tarea si hay una disponible, o null si no hay ninguna.
 */
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
        topics: [
          {
            topicName: topic,
            lockDuration
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Error en fetchAndLock: ${response.status}`);
  }

  const tasks = await response.json();
  return tasks.length > 0 ? tasks[0] : null;
}

/**
 * Polling: repite fetchAndLock cada `intervalMs` hasta encontrar una tarea
 * o hasta que se agote `timeoutMs` (por defecto 5 minutos).
 *
 * Uso:
 *   const task = await pollForTask("receive-person-data");
 */
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
        if (task) {
          clearInterval(interval);
          resolve(task);
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, intervalMs);
  });
}

// ─────────────────────────────────────────────
// COMPLETE
// ─────────────────────────────────────────────

/**
 * Completa una external task enviando los datos de la persona como variables.
 *
 * personData: { personName, personLastName, numberPhone, email }
 */
export async function completeExternalTask(taskId, personData) {
  const response = await fetch(
    `${CAMUNDA_ENGINE}/external-task/${taskId}/complete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerId: WORKER_ID,
        variables: {
          personName: {
            value: personData.personName,
            type: "String"
          },
          personLastName: {
            value: personData.personLastName,
            type: "String"
          },
          numberPhone: {
            value: personData.numberPhone.toString(),
            type: "String"
          },
          email: {
            value: personData.email,
            type: "String"
          }
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Error al completar tarea ${taskId}: ${JSON.stringify(error)}`
    );
  }

  return true;
}

// ─────────────────────────────────────────────
// FAILURE
// ─────────────────────────────────────────────

/**
 * Reporta un fallo en la external task.
 *
 * retries: cuántos reintentos le quedan al engine antes de marcarla como dead.
 * retryTimeout: milisegundos que espera el engine antes de exponerla de nuevo.
 */
export async function reportTaskFailure(
  taskId,
  errorMessage,
  retries = 2,
  retryTimeout = 5000
) {
  const response = await fetch(
    `${CAMUNDA_ENGINE}/external-task/${taskId}/failure`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerId: WORKER_ID,
        errorMessage,
        retries,
        retryTimeout
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error(
      `No se pudo reportar fallo de tarea ${taskId}:`,
      JSON.stringify(error)
    );
  }
}

// ─────────────────────────────────────────────
// FLUJO COMPLETO (orquestador)
// ─────────────────────────────────────────────

/**
 * Ejecuta el flujo completo:
 *   1. Arranca el proceso padre
 *   2. Espera a que el engine exponga la external task
 *   3. Completa la tarea con los datos de la persona
 *
 * En caso de error en el paso 3, reporta el fallo al engine.
 *
 * Uso:
 *   await runRegisterFlow({
 *     personName: "Ana",
 *     personLastName: "García",
 *     numberPhone: "3001234567",
 *     email: "ana@ejemplo.com"
 *   });
 */
export async function runRegisterFlow(personData) {
  // 1. Arrancar proceso padre
  const instance = await startRegisterProcess();
  console.log("Proceso iniciado:", instance.id);

  // 2. Esperar la external task (poll)
  let task;
  try {
    task = await pollForTask("receive-person-data", {
      intervalMs: 2000,
      timeoutMs: 300_000,
      lockDuration: 60000
    });
  } catch (err) {
    throw new Error(`No se encontró la tarea: ${err.message}`);
  }

  console.log("Tarea obtenida:", task.id);

  // 3. Completar con los datos
  try {
    await completeExternalTask(task.id, personData);
    console.log("Tarea completada correctamente.");
  } catch (err) {
    await reportTaskFailure(task.id, err.message);
    throw err;
  }

  return instance;
}