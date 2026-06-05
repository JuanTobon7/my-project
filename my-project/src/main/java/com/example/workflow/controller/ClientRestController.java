package com.example.workflow.controller;

import com.example.workflow.service.interf.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}
)
public class ClientRestController {
    private final EmailService emailService;

    @PostMapping("/register/notify")
    public ResponseEntity<?> notifyRegistration(@RequestBody Map<String, Object> body) {

        String personName = (String) body.get("personName");
        String lastName   = (String) body.get("personLastName");
        String email      = (String) body.get("email");
        String numberPhone = (String) body.get("numberPhone");


        log.info("✅ Cliente registrado exitosamente");
        log.info("   Nombre:   {}", personName);
        String subject = "Cliente registrado exitosamente";
        emailService.sendEmail(email, subject, "Felicidades " + personName + " " + lastName + " tu registro fue exitoso", "");
        return ResponseEntity.ok(Map.of("message", "Notificación procesada"));
    }
}