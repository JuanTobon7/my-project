package com.example.workflow.processes;

import com.example.workflow.model.PQR;
import com.example.workflow.repo.interf.PqrRepository;
import com.example.workflow.service.interf.EmailService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("NotifyResultsProcess")
@RequiredArgsConstructor
public class NotifyResultsProcess implements JavaDelegate {
    private final PqrRepository pqrRepository;
    private final EmailService emailService;

    private static final String ACCEPTED_FILE = "pqr-resuelto.html";
    private static final String REJECTED_FILE = "pqr-no-resuelto.html";
    private static final String SUBJECT = "Resultado de tu PQR";

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String email = (String) delegateExecution.getVariable("client_email");
        Optional<PQR> pqr = pqrRepository.getLastByEmail(email);
        boolean isProcessed = pqr.isPresent() && pqr.get().getIsProcessed();
        String result = isProcessed ? "Felicidades tu PQR ha sido procesada" : "Lo sentimos tu PQR no fue admitida";
        String file = isProcessed?ACCEPTED_FILE:REJECTED_FILE;
        emailService.sendEmail(email,SUBJECT,result, file);
    }
}
