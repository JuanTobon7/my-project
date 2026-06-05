# 📁 Estructura del Proyecto Frontend

```
my-project/front/
│
├── 📄 package.json                  # Dependencias y scripts del proyecto
├── 📄 package-lock.json             # Lock file de dependencias
├── 📄 jsconfig.json                 # Configuración de rutas en JSX
├── 📄 .env.example                  # Variables de entorno de ejemplo
├── 📄 .gitignore                    # Archivos ignorados por git
│
├── 📄 README.md                     # Documentación principal
├── 📄 GUIA_USO.md                   # Guía de usuario
├── 📄 ESTRUCTURA.md                 # Este archivo
│
├── 📁 public/                       # Archivos estáticos
│   └── 📄 index.html                # HTML raíz de la aplicación
│
└── 📁 src/                          # Código fuente
    │
    ├── 📄 index.jsx                 # Punto de entrada de React
    ├── 📄 App.jsx                   # Componente raíz
    ├── 📄 App.css                   # Estilos globales
    │
    ├── 📁 components/               # Componentes React reutilizables
    │   ├── 📄 ClientLoginForm.jsx   # Formulario de inicio de sesión
    │   ├── 📄 ClientLoginForm.css   # Estilos del login
    │   │
    │   ├── 📄 CreatePqrForm.jsx     # Formulario para crear PQR
    │   ├── 📄 CreatePqrForm.css     # Estilos del formulario
    │   │
    │   ├── 📄 PqrList.jsx           # Componente que lista todas las PQRs
    │   ├── 📄 PqrList.css           # Estilos de la lista
    │   │
    │   ├── 📄 PqrResultView.jsx     # Vista detallada de resultado de PQR
    │   ├── 📄 PqrResultView.css     # Estilos de resultado
    │   │
    │   ├── 📄 Dashboard.jsx         # Dashboard principal
    │   └── 📄 Dashboard.css         # Estilos del dashboard
    │
    ├── 📁 context/                  # Context API para estado global
    │   └── 📄 ClientContext.jsx     # Contexto del cliente autenticado
    │
    └── 📁 services/                 # Servicios de API
        └── 📄 pqrService.js         # Servicio para llamadas a API
```

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────┐
│      ClientLoginForm            │
│  (Ingreso de datos del cliente) │
└──────────────┬──────────────────┘
               │
               ▼
        [Guardar en Context]
               │
               ▼
┌─────────────────────────────────┐
│        Dashboard                │
│  (Vista principal)              │
├─────────────────────────────────┤
│  ┌──────────┐                   │
│  │ Navbar   │ (Info usuario)    │
│  └──────────┘                   │
│                                 │
│  ┌────────────────────────────┐ │
│  │  PqrList                   │ │ ◄─ Ver listado de PQRs
│  │  (Lista de PQRs)           │ │
│  └────────────────────────────┘ │
│         ▲        ▼              │
│    [Volver]  [Ver Resultado]    │
│         │        │              │
│         │        ▼              │
│    ┌─────────────────────────┐  │
│    │ CreatePqrForm           │  │ ◄─ Crear nueva PQR
│    │ (Nuevo PQR)             │  │
│    └─────────────────────────┘  │
│         │        ▲              │
│    [Enviar] [Volver]            │
│         │        │              │
│         └────┬───┘              │
│              ▼                   │
│    ┌─────────────────────────┐  │
│    │ PqrResultView           │  │ ◄─ Ver resultado procesado
│    │ (Resultado de PQR)      │  │
│    └─────────────────────────┘  │
└─────────────────────────────────┘
```

## 🔌 Flujo de Datos

```
┌─────────────────────────────────────────┐
│         React Components                │
│   (ClientLoginForm, CreatePqrForm,     │
│    PqrList, PqrResultView)             │
└──────────────┬──────────────────────────┘
               │
               │ Usa
               ▼
┌─────────────────────────────────────────┐
│       ClientContext (State Global)      │
│  - client: { name, lastName,           │
│             phone, email }             │
│  - setClientData()                     │
│  - logout()                            │
└──────────────┬──────────────────────────┘
               │
               │ Utiliza
               ▼
┌─────────────────────────────────────────┐
│        pqrService (Axios)               │
│  - startPqrProcess()                   │
│  - savePqr()                           │
│  - getAllPqrByEmail()                  │
│  - getPqrResult()                      │
└──────────────┬──────────────────────────┘
               │
               │ Realiza peticiones HTTP
               ▼
┌─────────────────────────────────────────┐
│    Backend API REST (Java/Spring)       │
│  - POST /pqr/start                     │
│  - POST /pqr/savePqr                   │
│  - GET /pqr/{email}                    │
│  - GET /pqr/{email}/result/{id}        │
└─────────────────────────────────────────┘
```

## 🎯 Componentes Principales

### 1. **ClientLoginForm**
- Entrada: Datos del cliente (nombre, apellido, teléfono, email)
- Proceso: Validación de formulario
- Salida: Almacena cliente en context y localStorage
- Estilos: Gradiente morado, diseño moderno

### 2. **Dashboard**
- Padre: Contiene toda la lógica de navegación entre vistas
- Hijos: ClientLoginForm, CreatePqrForm, PqrList, PqrResultView
- Responsable de: Mostrar navbar y cambiar entre vistas

### 3. **CreatePqrForm**
- Entrada: Tipo de PQR, descripción
- Proceso: Validación, llamada a API via pqrService
- Salida: Nueva PQR creada
- Retroalimentación: Mensaje de éxito/error

### 4. **PqrList**
- Entrada: Email del cliente
- Proceso: Obtiene lista de PQRs del backend
- Salida: Muestra lista con badges de tipo y estado
- Interacción: Permite ver resultado de PQR procesada

### 5. **PqrResultView**
- Entrada: Objeto PQR seleccionado
- Proceso: Obtiene resultado detallado del backend
- Salida: Muestra información completa y resultado
- Acciones: Imprimir, descargar (opcional)

### 6. **ClientContext**
- Estado global: Cliente autenticado
- Métodos: setClientData, logout, loadClientFromStorage
- Persistencia: localStorage

## 📱 Responsive Design

```
Desktop (>768px):         Tablet (768px):         Mobile (<768px):
┌──────────────────┐     ┌────────────────┐     ┌───────────────┐
│ [Logo] [Filtros] │     │ [Logo]         │     │ [Logo]        │
│ [User] [Logout]  │     │ [User] [Logout]│     │ [Menu]        │
├──────────────────┤     ├────────────────┤     ├───────────────┤
│                  │     │                │     │               │
│ Contenido        │     │ Contenido      │     │ Contenido     │
│ en dos columnas  │     │ Una columna    │     │ Full width    │
│                  │     │                │     │               │
│                  │     │                │     │               │
└──────────────────┘     └────────────────┘     └───────────────┘
```

## 🎨 Sistema de Colores

| Color | Uso | Código |
|-------|-----|--------|
| Azul Primario | Botones principales, enlaces | `#667eea` |
| Púrpura Secundario | Gradientes | `#764ba2` |
| Verde | Estados procesados, éxito | `#4caf50`, `#388e3c` |
| Naranja | Advertencias, tipo Queja | `#f57c00` |
| Rojo | Errores, tipo Reclamo | `#ef5350`, `#d32f2f` |
| Gris | Fondos, textos secundarios | `#e0e0e0`, `#999` |

## 📦 Dependencias

```json
{
  "react": "^18.2.0",              // UI Framework
  "react-dom": "^18.2.0",          // React DOM rendering
  "axios": "^1.6.0",               // HTTP client
  "react-router-dom": "^6.20.0",   // Routing (opcional para expansión)
  "date-fns": "^2.30.0"            // Date formatting
}
```

## 🚀 Scripts Disponibles

```bash
npm start       # Inicia desarrollo en puerto 3000
npm run build   # Construye versión optimizada para producción
npm test        # Ejecuta tests
npm eject       # Expone configuración (irreversible)
```

---

**Última actualización**: 2026
**Versión**: 1.0
