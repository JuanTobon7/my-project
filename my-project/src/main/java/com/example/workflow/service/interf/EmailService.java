package com.example.workflow.service.interf;

public interface EmailService {
    void sendEmail(String to, String subject, String body, String attachmentPath);
}
