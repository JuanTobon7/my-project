package com.example.workflow.service.impl;

import com.example.workflow.service.interf.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.File;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private static final String PREFIX = "/templates/email/";
    private final JavaMailSender mailSender;
    @Override
    @Async(value = "emailExecutor")
    public void sendEmail(String to, String subject, String body, String attachmentPath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            ClassPathResource resource =
                    new ClassPathResource("templates/email/" + attachmentPath);

            if (resource.exists()) {
                helper.addAttachment(
                        resource.getFilename(),
                        resource
                );
            }

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo con adjunto", e);
        }
    }
}
