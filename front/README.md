# Sistema de PQR - Frontend React

Una aplicación web moderna para gestionar Peticiones, Quejas y Reclamos (PQR) con una interfaz intuitiva y responsive.

## 📋 Características

- ✅ Autenticación de clientes por email, nombre y teléfono
- ✅ Crear nuevas PQRs con tipos (Petición, Queja, Reclamo)
- ✅ Listar todas las PQRs del cliente
- ✅ Ver resultados de PQRs procesadas
- ✅ Diseño responsive y moderno
- ✅ Interfaz intuitiva y fácil de usar
- ✅ Validación de formularios en cliente
- ✅ Gestión de estado con React Context API

## 🚀 Instalación

### Requisitos previos
- Node.js 14+ 
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
cd my-project/front
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` y configura la URL de tu API:
```
REACT_APP_API_URL=http://localhost:8080/api
```

4. **Iniciar la aplicación en desarrollo**
```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── ClientLoginForm.jsx    # Formulario de inicio de sesión
│   ├── CreatePqrForm.jsx      # Formulario para crear PQR
│   ├── PqrList.jsx            # Lista de PQRs del cliente
│   ├── PqrResultView.jsx      # Vista de resultado de PQR
│   ├── Dashboard.jsx          # Dashboard principal
│   └── *.css                  # Estilos de componentes
├── context/             # Context API
│   └── ClientContext.jsx      # Contexto de cliente
├── services/            # Servicios de API
│   └── pqrService.js         # Servicio para PQR
├── App.jsx              # Componente principal
├── App.css              # Estilos globales
└── index.jsx            # Punto de entrada
public/
├── index.html           # HTML raíz
└── ...
```

## 🔌 Endpoints de API Esperados

El frontend espera los siguientes endpoints en tu backend:

### Iniciar proceso de PQR
```
POST /api/pqr/start
Body: {
  pqrType: "PETICION" | "QUEJA" | "RECLAMO",
  description: string,
  email: string
}
Response: { success: boolean }
```

### Guardar PQR
```
POST /api/pqr/savePqr
Body: { PQR object }
Response: { success: boolean }
```

### Obtener todas las PQRs de un cliente
```
GET /api/pqr/{email}
Response: [
  {
    id: UUID,
    pqr: string,
    description: string,
    clientName: string,
    clientLastName: string,
    clientPhone: number,
    pqrType: string,
    progationDate: datetime,
    isProcessed: boolean
  }
]
```

### Obtener resultado de una PQR
```
GET /api/pqr/{email}/result/{id}
Response: { result: string }
```

## 🎨 Personalización

### Cambiar colores
Los colores principales están definidos en los archivos CSS:
- Color primario: `#667eea`
- Color secundario: `#764ba2`

Busca estas referencias en los archivos `.css` para personalizarlos.

### Cambiar tipos de PQR
En [src/components/CreatePqrForm.jsx](src/components/CreatePqrForm.jsx), modifica el array `PQR_TYPES`:

```javascript
const PQR_TYPES = [
  { value: 'PETICION', label: 'Petición' },
  { value: 'QUEJA', label: 'Queja' },
  { value: 'RECLAMO', label: 'Reclamo' }
];
```

## 📦 Build para Producción

```bash
npm run build
```

Esto genera una carpeta `build` lista para desplegar.

## 🧪 Testing

```bash
npm test
```

## 🛠️ Tecnologías

- **React** 18.2.0 - Librería UI
- **Axios** 1.6.0 - Cliente HTTP
- **React Router** 6.20.0 - Routing
- **Date-fns** 2.30.0 - Manipulación de fechas
- **CSS3** - Estilos modernos

## 📝 Notas Importantes

1. **Autenticación**: El cliente se almacena en `localStorage` para mantener la sesión activa.
2. **Validaciones**: Todos los formularios tienen validación en cliente.
3. **Responsivo**: La interfaz se adapta a todos los tamaños de pantalla.
4. **Accesibilidad**: Se implementaron buenas prácticas de accesibilidad.

## 🐛 Troubleshooting

### La API no responde
- Verifica que la URL en `.env.local` sea correcta
- Asegúrate de que tu backend esté corriendo
- Comprueba la consola del navegador para errores CORS

### Los estilos no se cargan correctamente
- Limpia la caché: `Ctrl+Shift+Delete` en Chrome
- Reconstruye: `npm run build`

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

## 📄 Licencia

Este proyecto está bajo licencia MIT.
