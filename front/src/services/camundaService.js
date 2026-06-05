// services/camundaService.js

const CAMUNDA_ENGINE = "http://localhost:8080/engine-rest";
export const WORKER_ID = "react-frontend-worker";

/**
 * Hace fetch + lock en una sola operación atómica.
 * Retorna la tarea si hay una disponible, o null si no hay ninguna.
 */
export async function fetchAndLockTask(topic) {
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
            lockDuration: 60000 // 60 segundos para completar
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Error al hacer fetchAndLock: ${response.status}`);
  }

  const tasks = await response.json();
  return tasks.length > 0 ? tasks[0] : null;
}

/**
 * Completa la tarea external con las variables del formulario.
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
          personName:     { value: personData.personName,                type: "String" },
          personLastName: { value: personData.personLastName,            type: "String" },
          numberPhone:    { value: personData.numberPhone.toString(),    type: "String" },
          email:          { value: personData.email,                     type: "String" }
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error al completar tarea: ${JSON.stringify(error)}`);
  }

  return true;
}

/**
 * Reporta un fallo a Camunda si algo sale mal en el cliente.
 * Útil para no dejar tareas bloqueadas indefinidamente.
 */
export async function reportTaskFailure(taskId, errorMessage) {
  await fetch(
    `${CAMUNDA_ENGINE}/external-task/${taskId}/failure`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerId: WORKER_ID,
        errorMessage: errorMessage,
        retries: 0,
        retryTimeout: 0
      })
    }
  );
}