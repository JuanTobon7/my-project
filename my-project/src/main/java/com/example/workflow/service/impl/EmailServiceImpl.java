package com.example.workflow.service.impl;

import com.example.workflow.service.interf.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
    public void sendEmail(String to, String subject, String body, String attachmentPath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            File attachment = new File(PREFIX+attachmentPath);
            if (attachment.exists()) {
                helper.addAttachment(attachment.getName(), attachment);
            }

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo con adjunto", e);
        }
    }
}
