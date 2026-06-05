// services/camundaService.js

const CAMUNDA_ENGINE = "http://localhost:8080/api/engine-rest";
export const WORKER_ID = "react-frontend-worker";

export async function startRegisterProcess() {
  const response = await fetch(
    `${CAMUNDA_ENGINE}/process-definition/key/store_people_in_crm/start`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variables: {} })
    }
  );

  if (!response.ok) {
    throw new Error(`Error al iniciar proceso: ${response.status}`);
  }

  return await response.json();
}

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
            lockDuration: 60000
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
    const error = await response.json();
    throw new Error(`Error al completar tarea: ${JSON.stringify(error)}`);
  }

  return true;
}

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