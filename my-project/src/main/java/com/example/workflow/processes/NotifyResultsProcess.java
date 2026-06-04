package com.example.workflow.processes;

import com.example.workflow.model.PQR;
import com.example.workflow.repo.interf.PqrRepository;
import com.example.workflow.service.interf.EmailService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("NotifyResultsProcess")
@RequiredArgsConstructor
public class NotifyResultsProcess implements JavaDelegate {
    private final PqrRepository pqrRepository;
    private final EmailService emailService;

    private static final String SUBJECT = "Resultado de tu PQR";
    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String email = (String) delegateExecution.getVariable("client_email");
        PQR pqr = pqrRepository.getLastByEmail(email);
        Boolean isProcessed = pqr.getIsProcessed();
        String result = isProcessed?"Felicidades tu PQR ha sido procesada":"Lo sentimos tu PQR no fue admitida";
        emailService.sendEmail(email,SUBJECT,result);
    }
}
