# 🚀 Flujo Actualizado - Creación de PQR (4 Pasos)

## 📊 Diagrama del Flujo

```
┌──────────────────────────────────────────────────────────────┐
│                    Frontend React                            │
│               (CreatePqrForm.jsx)                            │
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
│ PASO 1️⃣: POST /api/pqr/start                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Request:                                                    │
│ {                                                           │
│   "pqrType": "QUEJA",                                      │
│   "description": "Descripción del problema...",             │
│   "email": "jctobon@gmail.com"                             │
│ }                                                           │
│                                                              │
│ Backend:                                                    │
│ 1. Crea variables para Camunda                             │
│ 2. Verifica si cliente existe                              │
│ 3. Inicia proceso: "process_pqr_ambient"                   │
│ 4. Obtiene: instanceId                                     │
│                                                              │
│ Response:                                                   │
│ {                                                           │
│   "instanceId": "abc123...",                               │
│   "processDefinitionId": "process_pqr_ambient:1:xyz",      │
│   "message": "PQR iniciada correctamente"                  │
│ }                                                           │
│                                                              │
└──────────────┬───────────────────────────────────────────┘
               │
         ┌─────▼────────┐
         │ ¿Éxito?      │
         └──┬────────┬──┘
            │ NO     │ SÍ
            │        │
            ▼        ▼
        [Error]   PASO 2
                  ──────

┌──────────────────────────────────────────────────────────────┐
│ PASO 2️⃣: GET /api/pqr/tasks/{instanceId}                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Request:                                                    │
│ GET /api/pqr/tasks/abc123...                              │
│                                                              │
│ Backend:                                                    │
│ 1. Busca tarea pendiente del proceso                        │
│ 2. Obtiene taskId de la tarea                               │
│ 3. Obtiene nombre y clave de la tarea                       │
│                                                              │
│ Response:                                                   │
│ {                                                           │
│   "taskId": "task-xyz-789",                                │
│   "taskName": "Completar PQR",                             │
│   "taskKey": "task_complete_pqr"                           │
│ }                                                           │
│                                                              │
│ Frontend obtiene: taskId = "task-xyz-789"                   │
│                                                              │
└──────────────┬───────────────────────────────────────────┘
               │
         ┌─────▼────────┐
         │ ¿Éxito?      │
         └──┬────────┬──┘
            │ NO     │ SÍ
            │        │
            ▼        ▼
        [Error]   PASO 3
                  ──────

┌──────────────────────────────────────────────────────────────┐
│ PASO 3️⃣: Construir Objeto PQR                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Frontend construye objeto con todos los datos:              │
│                                                              │
│ {                                                           │
│   "pqr": "QUEJA",                                          │
│   "description": "Descripción del problema...",             │
│   "clientName": "Juan",                                    │
│   "clientLastName": "Tobón",                               │
│   "clientPhone": 3212527494,                               │
│   "pqrType": "QUEJA",                                      │
│   "progationDate": null,                                   │
│   "isProcessed": false                                     │
│ }                                                           │
│                                                              │
│ + Guardar: taskId = "task-xyz-789"                          │
│                                                              │
└──────────────┬───────────────────────────────────────────┘
               │
               ▼
            PASO 4
            ──────

┌──────────────────────────────────────────────────────────────┐
│ PASO 4️⃣: POST /api/pqr/save                                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Request:                                                    │
│ POST /api/pqr/save?task_id=task-xyz-789                   │
│                                                              │
│ Body:                                                       │
│ {                                                           │
│   "pqr": "QUEJA",                                          │
│   "description": "Descripción del problema...",             │
│   "clientName": "Juan",                                    │
│   "clientLastName": "Tobón",                               │
│   "clientPhone": 3212527494,                               │
│   "pqrType": "QUEJA",                                      │
│   "progationDate": null,                                   │
│   "isProcessed": false                                     │
│ }                                                           │
│                                                              │
│ Backend:                                                    │
│ 1. Recibe objeto PQR                                        │
│ 2. Guarda en Base de Datos                                  │
│ 3. Obtiene taskId del parámetro                             │
│ 4. Completa tarea Camunda: taskService.complete()           │
│ 5. Pasa variables de PQR a la siguiente tarea               │
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
            Mostrar mensaje
                     │
                     ▼
            Limpiar formulario
                     │
                     ▼
            Esperar 2 segundos
                     │
                     ▼
            Volver a lista de PQRs
```

## 💻 Código Frontend

### pqrService.js
```javascript
const pqrService = {
  // PASO 1
  startPqrProcess: (pqrType, description, email) => {
    return axios.post(`${API_URL}/pqr/start`, {
      pqrType,
      description,
      email
    });
  },

  // PASO 2
  getPendingTask: (instanceId) => {
    return axios.get(`${API_URL}/pqr/tasks/${instanceId}`);
  },

  // PASO 4
  savePqr: (pqr, taskId) => {
    const params = { task_id: taskId };
    return axios.post(`${API_URL}/pqr/save`, pqr, { params });
  },
};
```

### CreatePqrForm.jsx
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    // ✅ PASO 1: Iniciar proceso
    console.log('✅ PASO 1: Iniciando proceso PQR...');
    const startResponse = await pqrService.startPqrProcess(
      formData.pqrType,
      formData.description,
      client.email
    );
    const instanceId = startResponse.data.instanceId;
    console.log('✅ PASO 1 Éxito - instanceId:', instanceId);

    // ✅ PASO 2: Obtener taskId
    console.log('✅ PASO 2: Obteniendo taskId...');
    const taskResponse = await pqrService.getPendingTask(instanceId);
    const taskId = taskResponse.data.taskId;
    console.log('✅ PASO 2 Éxito - taskId:', taskId);

    // ✅ PASO 3: Construir objeto PQR
    console.log('✅ PASO 3: Construyendo PQR...');
    const completePqr = {
      pqr: formData.pqrType,
      description: formData.description,
      clientName: client.name,
      clientLastName: client.lastName,
      clientPhone: parseInt(client.phone),
      pqrType: formData.pqrType,
      progationDate: null,
      isProcessed: false
    };

    // ✅ PASO 4: Guardar PQR
    console.log('✅ PASO 4: Guardando PQR...');
    const saveResponse = await pqrService.savePqr(completePqr, taskId);
    console.log('✅ PASO 4 Éxito');

    // ✅ Éxito
    setSuccessMessage('¡PQR creada exitosamente!');
    setFormData({
      pqrType: '',
      description: ''
    });

    setTimeout(() => {
      setSuccessMessage('');
      if (onSuccess) onSuccess();
    }, 2000);

  } catch (error) {
    console.error('❌ Error:', error);
    setErrors({
      submit: error.response?.data?.message || error.message
    });
  } finally {
    setLoading(false);
  }
};
```

## 🔗 Endpoints Backend Requeridos

| Paso | Método | Endpoint | Parámetros | Respuesta |
|------|--------|----------|-----------|-----------|
| 1 | POST | `/pqr/start` | Body: StartPqrRequest | instanceId |
| 2 | GET | `/pqr/tasks/{instanceId}` | Path: instanceId | taskId, taskName |
| 4 | POST | `/pqr/save` | Query: task_id, Body: PQR | 200 OK |

## 📱 Flujo en Consola del Navegador

```
✅ PASO 1: Iniciando proceso PQR...
✅ PASO 1 Éxito - instanceId: abc123xyz
✅ PASO 2: Obteniendo taskId...
✅ PASO 2 Éxito - taskId: task-xyz-789
✅ PASO 3: Construyendo objeto PQR completo...
Objeto PQR: { pqr: "QUEJA", ... }
✅ PASO 4: Guardando PQR en la base de datos...
✅ PASO 4 Éxito - Respuesta: {}
```

## ✅ Requisitos

1. **Backend Spring Boot**:
   - ✅ Endpoint POST /pqr/start
   - ✅ Endpoint GET /pqr/tasks/{instanceId}
   - ✅ Endpoint POST /pqr/save
   - ✅ CORS habilitado para localhost:3000

2. **Camunda**:
   - ✅ Proceso: `process_pqr_ambient`
   - ✅ RuntimeService activo
   - ✅ TaskService activo

3. **Frontend**:
   - ✅ pqrService.js con 3 métodos
   - ✅ CreatePqrForm.jsx con 4 pasos
   - ✅ uuid importado

## 🐛 Debugging

Si algo falla, revisa:

1. **Console del navegador** (F12):
   - Ver qué paso falla
   - Ver respuesta del servidor

2. **Console del backend**:
   - `System.out.println()` en PqrRestController
   - Ver si taskId se obtiene correctamente

3. **Red** (DevTools > Network):
   - Ver todos los requests/responses
   - Verificar status codes

---

**Versión**: 2.0 (Actualizado con 4 pasos)
**Última actualización**: 2026-06-04
