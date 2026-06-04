# 🔄 Flujo Completo de Creación de PQR

## Diagrama del Flujo (4 Pasos)

```
┌─────────────────────────────────────────────────────────┐
│        Frontend - React (CreatePqrForm)                 │
│                                                         │
│  Usuario llena formulario y hace click en "Enviar PQR"  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Validar formulario    │
        │  - Tipo: requerido     │
        │  - Descripción: 20-500 │
        └────────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  Validación exitosa?  │
         └───┬─────────────────┬─┘
             │ NO              │ SÍ
             │                 │
             ▼                 ▼
    [Mostrar errores]   PASO 1: START
                        ──────────────
                        
┌─────────────────────────────────────────────────────────┐
│ PASO 1: POST /api/pqr/start                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Envío:                                                 │
│ {                                                       │
│   "pqrType": "QUEJA",                                  │
│   "description": "Descripción del problema",           │
│   "email": "jctobon@gmail.com"                         │
│ }                                                       │
│                                                         │
│ Procesamiento en Backend:                              │
│ 1. Crear variables para Camunda:                       │
│    - client_pqr: "QUEJA"                               │
│    - client_pqr_description: "Descripción..."          │
│                                                         │
│ 2. Verificar si cliente existe:                        │
│    - clientService.getExistenceByEmail()               │
│                                                         │
│ 3. Iniciar proceso Camunda:                            │
│    - runtimeService.startProcessInstanceByKey(...)     │
│    - Obtener: instanceId                               │
│                                                         │
│ 4. Guardar variable en Camunda:                        │
│    - client_in_system: true/false                      │
│                                                         │
│ Respuesta (200 OK):                                    │
│ {                                                       │
│   "success": true,                                     │
│   "instanceId": "550e8400-e29b-41d4-a716-446655440000",│
│   "processDefinitionId": "process_pqr_ambient:1:xyz",  │
│   "message": "PQR iniciada correctamente"              │
│ }                                                       │
│                                                         │
└────────────────┬─────────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │ ¿Éxito en API? │
         └───┬─────────┬──┘
             │ NO      │ SÍ
             │         │
             ▼         ▼
      [Error]    PASO 2: BUILD PQR OBJECT
                 ──────────────────────────

┌─────────────────────────────────────────────────────────┐
│ PASO 2: Construir Objeto PQR Completo                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Crear nuevo objeto con todos los datos:                │
│                                                         │
│ {                                                       │
│   "id": "660e8400-e29b-41d4-a716-446655440001",       │
│   "pqr": "PQR-1717532400000",                          │
│   "description": "Descripción del problema",           │
│   "clientName": "Juan",                                │
│   "clientLastName": "Tobón",                           │
│   "clientPhone": 3212527494,                           │
│   "pqrType": "QUEJA",                                  │
│   "progationDate": "2026-06-04T14:30:00.000Z",        │
│   "isProcessed": false                                 │
│ }                                                       │
│                                                         │
│ + Guardar instanceId de PASO 1 para enviar a PASO 3   │
│                                                         │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
           PASO 3: SAVE
           ──────────────

┌─────────────────────────────────────────────────────────┐
│ PASO 3: POST /api/pqr/save                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Envío:                                                 │
│ Body (JSON):                                           │
│ {                                                       │
│   "id": "660e8400-e29b-41d4-a716-446655440001",       │
│   "pqr": "PQR-1717532400000",                          │
│   "description": "Descripción del problema",           │
│   "clientName": "Juan",                                │
│   "clientLastName": "Tobón",                           │
│   "clientPhone": 3212527494,                           │
│   "pqrType": "QUEJA",                                  │
│   "progationDate": "2026-06-04T14:30:00.000Z",        │
│   "isProcessed": false                                 │
│ }                                                       │
│                                                         │
│ Query Parameter:                                       │
│ ?proccess_camunda_key=550e8400-e29b-41d4-a716-44     │
│                                                         │
│ Procesamiento en Backend:                              │
│ 1. Validar PQR (id y descripción requeridos)          │
│                                                         │
│ 2. Guardar en Base de Datos:                          │
│    - clientService.savePqr(pqr)                        │
│                                                         │
│ 3. Completar Tarea en Camunda (opcional):              │
│    - taskService.complete(                             │
│        processCamundaKey,                              │
│        pqr.toMap()                                     │
│      )                                                 │
│                                                         │
│ Respuesta (200 OK):                                    │
│ {                                                       │
│   "success": true,                                     │
│   "message": "PQR guardada exitosamente",              │
│   "id": "660e8400-e29b-41d4-a716-446655440001",       │
│   "pqr": { ... }                                       │
│ }                                                       │
│                                                         │
└────────────────┬─────────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │ ¿Éxito en API? │
         └───┬─────────┬──┘
             │ NO      │ SÍ
             │         │
             ▼         ▼
      [Error]    [Mostrar mensaje
                  de éxito]
                       │
                       ▼
                 [Limpiar formulario]
                       │
                       ▼
                 [Esperar 2 segundos]
                       │
                       ▼
                 [Volver a la lista
                  de PQRs]
```

## 📝 Código Frontend - CreatePqrForm

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    // PASO 1: Iniciar proceso en Camunda
    const startResponse = await pqrService.startPqrProcess(
      formData.pqrType,
      formData.description,
      client.email
    );
    // Obtenemos: startResponse.data.instanceId

    // PASO 2: Construir objeto PQR completo
    const pqrId = uuidv4();
    const completePqr = {
      id: pqrId,
      pqr: `PQR-${Date.now()}`,
      description: formData.description,
      clientName: client.name,
      clientLastName: client.lastName,
      clientPhone: parseInt(client.phone),
      pqrType: formData.pqrType,
      progationDate: new Date().toISOString(),
      isProcessed: false
    };

    // PASO 3: Guardar PQR en base de datos
    const saveResponse = await pqrService.savePqr(
      completePqr,
      startResponse.data.instanceId
    );

    // Éxito
    setSuccessMessage('¡PQR creada exitosamente!');
    setFormData({ pqrType: '', description: '' });

    setTimeout(() => {
      setSuccessMessage('');
      if (onSuccess) onSuccess();
    }, 2000);

  } catch (error) {
    // Error
    setErrors({
      submit: error.response?.data?.message || 'Error al crear la PQR'
    });
  } finally {
    setLoading(false);
  }
};
```

## 📡 Servicio de API - pqrService.js

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

  // PASO 3
  savePqr: (pqr, processCamundaKey) => {
    const params = processCamundaKey ? { proccess_camunda_key: processCamundaKey } : {};
    return axios.post(`${API_URL}/pqr/save`, pqr, { params });
  },

  // Otros métodos...
};
```

## ⚡ Requisitos

1. **UUID**: Instalado en `package.json` como `uuid: ^9.0.0`

2. **Backend API**:
   - Debe soportar CORS para `http://localhost:3000`
   - Endpoints: `/pqr/start` y `/pqr/save`
   - ClientService debe tener método `savePqr()`

3. **Camunda**:
   - Debe tener proceso `process_pqr_ambient`
   - TaskService debe poder completar tareas con variables

## 🐛 Debugging

### Ver logs en consola del navegador

```javascript
// Logs agregados:
console.log('Iniciando proceso PQR...');
console.log('Respuesta de start:', startResponse.data);
console.log('Guardando PQR completa:', completePqr);
console.log('Respuesta de save:', saveResponse.data);
console.log('Error en el proceso:', error);
```

### Ver logs en backend Java

```java
@Slf4j
// Los logs que agregué:
log.info("Iniciando proceso PQR para email: {}", request.email());
log.info("Proceso PQR iniciado con instanceId: {}", instance.getId());
log.info("Guardando PQR: {}", pqr.getId());
log.info("PQR guardada en BD: {}", savedPqr.getId());
log.info("Tarea Camunda completada: {}", processCamundaKey);
```

## ✅ Checklist de Verificación

- [ ] Frontend enviando POST a `/pqr/start` ✓
- [ ] Backend retornando `instanceId` ✓
- [ ] Frontend construyendo objeto PQR completo ✓
- [ ] Frontend enviando POST a `/pqr/save` con objeto ✓
- [ ] Backend guardando en BD ✓
- [ ] Backend completando tarea Camunda ✓
- [ ] Frontend mostrando mensaje de éxito ✓
- [ ] Frontend volviendo a lista de PQRs ✓

---

**Versión**: 1.0
**Última actualización**: 2026-06-04
