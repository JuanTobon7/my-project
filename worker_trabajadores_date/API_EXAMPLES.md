# 📡 Ejemplos de API - Requests y Responses

Esta guía muestra los ejemplos exactos de requests y responses esperados por el frontend.

## 🔗 Endpoints Esperados

Base URL: `http://localhost:8080/api` (configurable en `.env.local`)

---

## 1️⃣ POST /pqr/start - Iniciar Proceso de PQR

### Request
```javascript
POST /api/pqr/start
Content-Type: application/json

{
  "pqrType": "QUEJA",
  "description": "El servicio no funcionó correctamente en la mañana del 15 de junio",
  "email": "jctobon@gmail.com"
}
```

### Response Success (200)
```json
{
  "success": true,
  "message": "PQR iniciada exitosamente",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Response Error (400)
```json
{
  "success": false,
  "message": "Los campos requeridos no pueden estar vacíos",
  "errors": {
    "pqrType": "Tipo de PQR inválido",
    "description": "La descripción es muy corta"
  }
}
```

---

## 2️⃣ POST /pqr/savePqr - Guardar PQR Completa

### Request
```javascript
POST /api/pqr/savePqr
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "pqr": "PQR-2024-001",
  "description": "Solicito información sobre los requisitos para acceso",
  "clientName": "Juan",
  "clientLastName": "Tobón",
  "clientPhone": 3212527494,
  "pqrType": "PETICION",
  "progationDate": "2026-06-04T10:30:00",
  "isProcessed": false
}
```

### Response Success (200)
```json
{
  "success": true,
  "message": "PQR guardada correctamente",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Response Error (400)
```json
{
  "success": false,
  "message": "Error al guardar la PQR",
  "error": "Duplicated PQR ID"
}
```

---

## 3️⃣ GET /pqr/{email} - Obtener Todas las PQRs del Cliente

### Request
```javascript
GET /api/pqr/jctobon@gmail.com
```

### Response Success (200)
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "pqr": "PQR-2024-001",
    "description": "Solicito información sobre los requisitos para acceso",
    "clientName": "Juan",
    "clientLastName": "Tobón",
    "clientPhone": 3212527494,
    "pqrType": "PETICION",
    "progationDate": "2026-06-04T10:30:00",
    "isProcessed": false
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "pqr": "PQR-2024-002",
    "description": "El servicio no funcionó correctamente en la mañana del 15 de junio",
    "clientName": "Juan",
    "clientLastName": "Tobón",
    "clientPhone": 3212527494,
    "pqrType": "QUEJA",
    "progationDate": "2026-06-02T14:15:00",
    "isProcessed": true
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "pqr": "PQR-2024-003",
    "description": "Exijo el reembolso de mi pago ya que no se prestó el servicio",
    "clientName": "Juan",
    "clientLastName": "Tobón",
    "clientPhone": 3212527494,
    "pqrType": "RECLAMO",
    "progationDate": "2026-05-28T09:45:00",
    "isProcessed": true
  }
]
```

### Response Success (Sin PQRs) - Array vacío (200)
```json
[]
```

### Response Error (404)
```json
{
  "success": false,
  "message": "No se encontraron PQRs para este cliente",
  "email": "jctobon@gmail.com"
}
```

---

## 4️⃣ GET /pqr/{email}/result/{id} - Obtener Resultado de una PQR

### Request
```javascript
GET /api/pqr/jctobon@gmail.com/result/660e8400-e29b-41d4-a716-446655440001
```

### Response Success (200)
```
Se revisó el reporte de incidencias del 15 de junio y se encontró que fue un problema temporal en el servidor que afectó a varios usuarios entre las 9:00 AM y las 11:30 AM.

Se implementaron las siguientes acciones correctivas:
- Aumento en la capacidad de servidores
- Implementación de sistema de failover automático
- Mejora en el monitoreo 24/7

El servicio ha estado funcionando de manera normal desde entonces. Le ofrecemos un crédito del 15% en su próximo pago como compensación por los inconvenientes ocasionados.

Atentamente,
Equipo de Soporte Técnico
```

### Response Error (404)
```json
{
  "success": false,
  "message": "No se encontró resultado para esta PQR"
}
```

### Response Error (400)
```json
{
  "success": false,
  "message": "La PQR aún no ha sido procesada"
}
```

---

## 🧪 Ejemplos con cURL

### Crear nueva PQR
```bash
curl -X POST http://localhost:8080/api/pqr/start \
  -H "Content-Type: application/json" \
  -d '{
    "pqrType": "QUEJA",
    "description": "Descripción detallada de mi queja",
    "email": "jctobon@gmail.com"
  }'
```

### Obtener PQRs de un cliente
```bash
curl -X GET http://localhost:8080/api/pqr/jctobon@gmail.com
```

### Obtener resultado de una PQR
```bash
curl -X GET http://localhost:8080/api/pqr/jctobon@gmail.com/result/550e8400-e29b-41d4-a716-446655440000
```

---

## 🧪 Ejemplos con Postman

### 1. Crear colección "PQR API"

### 2. Variables de entorno
```json
{
  "base_url": "http://localhost:8080/api",
  "email": "jctobon@gmail.com",
  "pqr_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 3. Requests

#### POST - Start PQR
```
Method: POST
URL: {{base_url}}/pqr/start
Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "pqrType": "QUEJA",
  "description": "Descripción detallada de la queja",
  "email": "{{email}}"
}
```

#### GET - List PQRs
```
Method: GET
URL: {{base_url}}/pqr/{{email}}
```

#### GET - Get Result
```
Method: GET
URL: {{base_url}}/pqr/{{email}}/result/{{pqr_id}}
```

---

## ⚡ Códigos de Estado HTTP Esperados

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 200 | OK - Exitoso | GET retorna lista |
| 201 | Created - Creado | POST crea nuevo recurso |
| 400 | Bad Request - Solicitud inválida | Validación fallida |
| 404 | Not Found - No encontrado | Email sin PQRs |
| 500 | Server Error - Error del servidor | Fallo en BD |

---

## 📝 Notas Importantes

### Formato de Fechas
- Todas las fechas se envían en formato ISO 8601: `YYYY-MM-DDTHH:mm:ss`
- Ejemplo: `2026-06-04T10:30:00`
- El frontend convertirá automáticamente al formato local

### Tipos de PQR Válidos
```
"PETICION"  → Petición
"QUEJA"     → Queja
"RECLAMO"   → Reclamo
```

### Validaciones Esperadas del Backend

#### Nombre del cliente
- No vacío
- Máximo 50 caracteres

#### Descripción PQR
- Mínimo 20 caracteres
- Máximo 500 caracteres
- No vacío

#### Teléfono
- 10 dígitos
- Solo números

#### Email
- Formato válido de email
- No vacío

### Headers Recomendados
```
Content-Type: application/json
Accept: application/json
```

### CORS
Si el frontend está en un puerto diferente al backend:
```java
// En tu backend Spring Boot, agrega:
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/pqr")
public class PqrRestController { ... }
```

---

## 🔒 Seguridad

- Valida TODOS los inputs en el servidor
- Sanitiza la descripción para evitar XSS
- Usa HTTPS en producción
- Implementa autenticación/autorización si es necesario
- Limita la velocidad de requests (rate limiting)

---

**Última actualización**: 2026
**Versión de API**: 1.0
