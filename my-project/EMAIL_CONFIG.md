# Configuración de Servicio de Correos - Google SMTP

## Descripción
El proyecto incluye un servicio de correos integrado con Google SMTP que permite enviar correos electrónicos desde tu aplicación.

## Clases Implementadas

### 1. `EmailService` (Interfaz)
Ubicación: `src/main/java/com/example/workflow/service/interf/EmailService.java`

Métodos disponibles:
- `sendEmail(String to, String subject, String body)` - Enviar correo simple
- `sendEmailWithAttachment(String to, String subject, String body, String attachmentPath)` - Enviar correo con archivo adjunto

### 2. `EmailServiceImpl` (Implementación)
Ubicación: `src/main/java/com/example/workflow/service/impl/EmailServiceImpl.java`

Implementa la interfaz EmailService con soporte para:
- Correos simples
- Correos con adjuntos
- Manejo de excepciones

## Configuración Necesaria

### Paso 1: Habilitar Google SMTP

1. Accede a tu cuenta de Google: https://myaccount.google.com/
2. Ve a "Seguridad" en el menú lateral
3. Habilita "Verificación en dos pasos" (si no está ya activado)
4. Ve a "Contraseñas de aplicación"
5. Selecciona "Correo" y "Windows" (o tu SO)
6. Google generará una contraseña de 16 caracteres

### Paso 2: Configurar Variables de Entorno

#### Opción A: Variables de Entorno del Sistema (Windows)

1. Abre "Variables de entorno"
2. Haz clic en "Nueva"
3. Agrega las siguientes variables:
   - `MAIL_USERNAME=tu-email@gmail.com`
   - `MAIL_PASSWORD=xxxx xxxx xxxx xxxx` (contraseña de aplicación)

#### Opción B: Archivo `.env` (Desarrollo local)

1. Copia `.env.example` a `.env`
2. Completa los valores:
   ```
   MAIL_USERNAME=tu-email@gmail.com
   MAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

3. Para que Spring Boot lea el archivo `.env`, agrega a `application.properties`:
   ```properties
   spring.config.import=file:.env[optional]
   ```

#### Opción C: Parámetros de Inicio

Inicia la aplicación con:
```bash
java -jar aplicacion.jar --MAIL_USERNAME=tu-email@gmail.com --MAIL_PASSWORD=xxxx
```

### Paso 3: Verificar la Configuración

Las propiedades SMTP ya están configuradas en `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## Uso en la Aplicación

### Inyectar el Servicio

```java
@RestController
@RequiredArgsConstructor
public class MiController {
    private final EmailService emailService;
    
    @PostMapping("/enviar-correo")
    public ResponseEntity<String> enviarCorreo() {
        emailService.sendEmail(
            "destinatario@ejemplo.com",
            "Asunto del Correo",
            "Contenido del correo"
        );
        return ResponseEntity.ok("Correo enviado");
    }
}
```

### Ejemplo con Adjunto

```java
emailService.sendEmailWithAttachment(
    "destinatario@ejemplo.com",
    "Reporte",
    "Adjunto el reporte solicitado",
    "/ruta/al/archivo.pdf"
);
```

## Notas Importantes

- **Contraseña de Aplicación**: Usa la contraseña de 16 caracteres generada por Google, NO tu contraseña de Gmail
- **Límites**: Google tiene límites de envío (típicamente 500 correos por día)
- **Seguridad**: Nunca hagas commit del archivo `.env` con contraseñas reales
- **Desarrollo**: Para desarrollo local, configura las variables de entorno en tu IDE

## Troubleshooting

### Error: "Failed to authenticate"
- Verifica que la contraseña de aplicación sea correcta (16 caracteres)
- Asegúrate de habilitar "Verificación en dos pasos" en tu cuenta

### Error: "Connection refused"
- Verifica la conexión a internet
- Asegúrate de que el puerto 587 esté disponible

### Error: "javax.mail.AuthenticationFailedException"
- Las variables de entorno no se están cargando
- Reinicia la aplicación después de cambiar las variables

## Recursos Útiles

- [Google Account Recovery](https://myaccount.google.com/security)
- [Spring Mail Documentation](https://spring.io/guides/gs/sending-email/)
