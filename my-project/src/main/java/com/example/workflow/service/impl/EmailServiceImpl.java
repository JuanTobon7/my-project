package com.example.workflow.service.impl;

import com.example.workflow.service.interf.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    @Override
    public void sendEmail(String to, String subject, String content) {

    }
}
