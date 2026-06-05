# 🚀 Flujo Final - Creación de PQR (6 Pasos)

## 📊 Diagrama del Flujo

```
┌──────────────────────────────────────────────────────────────┐
│                    Usuario - Frontend React                  │
│               Rellena formulario de PQR                       │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ Validar formulario   │
            │ - Tipo ✓             │
            │ - Descripción ✓      │
            └──────┬───────────────┘
                   │
         ┌─────────▼─────────┐
         │ ¿Válido?          │
         └──┬──────────────┬─┘
            │ NO           │ SÍ
            │              │
            ▼              ▼
       [Error]        PASO 1
                      ──────

┌──────────────────────────────────────────────────────────────┐
│ PASO 1️⃣: GET /api/pqr                                        │
├──────────────────────────────────────────────────────────────┤
│ ▶️ Inicializa nueva instancia del proceso                     │
│                                                              │
│ Response:                                                    │
│ {                                                           │
│   "instanceId": "abc123xyz...",                             │
│   "processDefinitionId": "process_pqr_ambient:1:..."        │
│ }                                                           │
│                                                              │
│ Frontend: Guarda instanceId en localStorage                 │
│                                                              │
└──────────────┬───────────────────────────────────────────┘
               │
               ▼
            PASO 2
            ──────

┌──────────────────────────────────────────────────────────────┐
│ PASO 2️⃣: GET /api/pqr/tasks/{instanceId}                    │
├──────────────────────────────────────────────────────────────┤
│ ▶️ Obtiene el task pendiente actual (PqrProcess)             │
│                                                              │
│ Response:                                                    │
│ {                                                           │
│   "taskId": "task-xyz-789",                                │
│   "taskName": "Completa datos PQR",                         │
│   "taskKey": "task_pqr_process"                            │
│ }                                                           │
│                                                              │
│ Frontend: Guarda taskId para completar la tarea             │
│                                                              │
└──────────────┬───────────────────────────────────────────┘
               │
               ▼
            PASO 3
            ──────

┌──────────────────────────────────────────────────────────────┐
│ PASO 3️⃣: POST /api/pqr/start?task_id={taskId}               │
├──────────────────────────────────────────────────────────────┤
│ ▶️ Completa task PqrProcess con datos del formulario          │
│                                                              │
│ Request Body:                                               │
│ {                                                           │
│   "pqrType": "QUEJA",                                      │
│   "description": "Descripción detallada...",                │
│   "email": "jctobon@gmail.com"                             │
│ }                                                           │
│                                                              │
│ Backend:                                                    │
│ 1. Verifica si cliente existe                               │
│ 2. Prepara variables para Camunda                           │
│ 3. Completa el task PqrProcess                              │
│ 4. Avanza al siguiente task en el proceso                   │
│                                                              │
│ Response:                                                   │
│ {                                                           │
│   "message": "PQR iniciada correctamente"                  │
│ }                                                           │
│                                                              │
└──────────────┬───────────────────────────────────────────┘
               │
               ▼
            PASO 4
            ──────

┌──────────────────────────────────────────────────────────────┐
│ PASO 4️⃣: GET /api/pqr/tasks/{instanceId}                    │
├──────────────────────────────────────────────────────────────┤
│ ▶️ Obtiene el siguiente task (SavePqr)                        │
│                                                              │
│ Response:                                                   │
│ {                                                           │
│   "taskId": "task-abc-456",                                │
│   "taskName": "Guardar PQR",                               │
│   "taskKey": "task_save_pqr"                               │
│ }                                                           │
│                                                              │
│ Frontend: Guarda nuevo taskId para el siguiente paso        │
│                                                              │
└──────────────┬───────────────────────────────────────────┘
               │
               ▼
            PASO 5
            ──────

┌──────────────────────────────────────────────────────────────┐
│ PASO 5️⃣: Construir Objeto PQR Completo                       │
├──────────────────────────────────────────────────────────────┤
│ ▶️ Frontend arma el objeto con todos los datos               │
│                                                              │
│ Objeto creado:                                              │
│ {                                                           │
│   "pqr": "PQR-1717532400000",                               │
│   "description": "Descripción detallada...",                │
│   "clientName": "Juan",                                    │
│   "clientLastName": "Tobón",                               │
│   "clientPhone": 3212527494,                               │
│   "pqrType": "QUEJA",                                      │
│   "progationDate": "2026-06-04T14:30:00.000Z",            │
│   "isProcessed": false                                     │
│ }                                                           │
│                                                              │
└──────────────┬───────────────────────────────────────────┘
               │
               ▼
            PASO 6
            ──────

┌──────────────────────────────────────────────────────────────┐
│ PASO 6️⃣: POST /api/pqr/save?task_id={saveTaskId}            │
├──────────────────────────────────────────────────────────────┤
│ ▶️ Completa task SavePqr guardando la PQR                    │
│                                                              │
│ Request:                                                    │
│ Query: ?task_id=task-abc-456                               │
│ Body: { objeto PQR completo }                              │
│                                                              │
│ Backend:                                                    │
│ 1. Recibe objeto PQR                                        │
│ 2. Guarda en Base de Datos                                  │
│ 3. Completa el task SavePqr con datos PQR                   │
│ 4. Avanza a siguiente proceso (si existe)                   │
│                                                              │
│ Response:                                                   │
│ {} (HTTP 200 OK)                                            │
│                                                              │
└──────────────┬───────────────────────────────────────────┘
               │
         ┌─────▼────────┐
         │ ¿Éxito?      │
         └──┬────────┬──┘
            │ NO     │ SÍ
            │        │
            ▼        ▼
        [Error]   ✅ SUCCESS
                     │
                     ▼
            Mostrar mensaje éxito
                     │
                     ▼
            Limpiar formulario
                     │
                     ▼
            Limpiar localStorage
                     │
                     ▼
            Esperar 2 segundos
                     │
                     ▼
            Volver a lista de PQRs
```

## 💻 Código Frontend

### pqrService.js - Métodos principales
```javascript
const pqrService = {
  // PASO 1 - Inicializa el proceso
  initializeProcess: () => {
    return axios.get(`${API_URL}/pqr`);
  },

  // PASO 2 y 4 - Obtiene task pendiente
  getPendingTask: (instanceId) => {
    return axios.get(`${API_URL}/pqr/tasks/${instanceId}`);
  },

  // PASO 3 - Completa task PqrProcess
  startPqrProcess: (pqrType, description, email, taskId) => {
    return axios.post(`${API_URL}/pqr/start`, {
      pqrType,
      description,
      email
    }, {
      params: { task_id: taskId }
    });
  },

  // PASO 6 - Completa task SavePqr
  savePqr: (pqr, taskId) => {
    return axios.post(`${API_URL}/pqr/save`, pqr, {
      params: { task_id: taskId }
    });
  }
};
```

### CreatePqrForm.jsx - Flujo completo
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);

  try {
    // ✅ PASO 1: Inicializar instancia
    console.log('✅ PASO 1: Inicializando instancia...');
    const initResponse = await pqrService.initializeProcess();
    const instanceId = initResponse.data.instanceId;
    localStorage.setItem('instanceId', instanceId);

    // ✅ PASO 2: Obtener task PqrProcess
    console.log('✅ PASO 2: Obteniendo task PqrProcess...');
    const taskResponse = await pqrService.getPendingTask(instanceId);
    const pqrTaskId = taskResponse.data.taskId;

    // ✅ PASO 3: Completar task PqrProcess
    console.log('✅ PASO 3: Completando task PqrProcess...');
    await pqrService.startPqrProcess(
      formData.pqrType,
      formData.description,
      client.email,
      pqrTaskId
    );

    // ✅ PASO 4: Obtener task SavePqr
    console.log('✅ PASO 4: Obteniendo task SavePqr...');
    const nextTaskResponse = await pqrService.getPendingTask(instanceId);
    const saveTaskId = nextTaskResponse.data.taskId;

    // ✅ PASO 5: Construir objeto PQR
    console.log('✅ PASO 5: Construyendo objeto PQR...');
    const completePqr = {
      pqr: `PQR-${Date.now()}`,
      description: formData.description,
      clientName: client.name,
      clientLastName: client.lastName,
      clientPhone: parseInt(client.phone),
      pqrType: formData.pqrType,
      progationDate: new Date().toISOString(),
      isProcessed: false
    };

    // ✅ PASO 6: Completar task SavePqr
    console.log('✅ PASO 6: Completando task SavePqr...');
    await pqrService.savePqr(completePqr, saveTaskId);

    // Limpiar
    localStorage.removeItem('instanceId');
    localStorage.removeItem('currentTaskId');

    setSuccessMessage('¡PQR creada exitosamente!');
    setFormData({ pqrType: '', description: '' });

    setTimeout(() => {
      setSuccessMessage('');
      if (onSuccess) onSuccess();
    }, 2000);

  } catch (error) {
    console.error('❌ Error:', error);
    setErrors({ submit: error.response?.data?.message || error.message });
  } finally {
    setLoading(false);
  }
};
```

## 📋 Logs en Consola del Navegador

```
✅ PASO 1: Inicializando instancia del proceso...
✅ PASO 1 Éxito - instanceId: abc123xyz...

✅ PASO 2: Obteniendo taskId del proceso PqrProcess...
✅ PASO 2 Éxito - taskId: task-xyz-789

✅ PASO 3: Completando task PqrProcess...
✅ PASO 3 Éxito

✅ PASO 4: Obteniendo siguiente task SavePqr...
✅ PASO 4 Éxito - saveTaskId: task-abc-456

✅ PASO 5: Construyendo objeto PQR...
Objeto PQR: { pqr: "PQR-1717532400000", ... }

✅ PASO 6: Completando task SavePqr...
✅ PASO 6 Éxito - Respuesta: {}
```

## 🔗 Endpoints Backend Requeridos

| Paso | Método | Endpoint | Descripción |
|------|--------|----------|-------------|
| 1 | GET | `/pqr` | Inicializa instancia |
| 2 | GET | `/pqr/tasks/{instanceId}` | Obtiene task actual |
| 3 | POST | `/pqr/start?task_id={taskId}` | Completa PqrProcess |
| 4 | GET | `/pqr/tasks/{instanceId}` | Obtiene siguiente task |
| 6 | POST | `/pqr/save?task_id={taskId}` | Completa SavePqr |

## ✅ Requisitos

✅ Backend con endpoints implementados
✅ Camunda con proceso `process_pqr_ambient`
✅ Dos tareas en el flujo: PqrProcess y SavePqr
✅ Frontend con pqrService y CreatePqrForm actualizados

## 🎯 Ventajas del Flujo

✅ Totalmente dinámico - obtiene tasks del servidor
✅ Maneja múltiples tareas en el flujo
✅ LocalStorage para gestionar estado temporal
✅ Logs detallados para debugging
✅ Manejo robusto de errores en cada paso

---

**Versión**: 3.0 (Flujo Final - 6 Pasos)
**Última actualización**: 2026-06-04
