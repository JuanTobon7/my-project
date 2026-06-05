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
    private static final String NO_REGISTERED = "No se encuentra registrado";


    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String email = (String) delegateExecution.getVariable("client_email");
        Boolean clientIsInSystem = (Boolean) delegateExecution.getVariable("client_in_system");
        if(!clientIsInSystem){
            String result = "No perteneces al sistema ingresa por favor con el link:" +
                    "http://localhost:3000/register-person";
            emailService.sendEmail(email,NO_REGISTERED,result, null);
            return;
        }
        Optional<PQR> pqr = pqrRepository.getLastByEmail(email);
        boolean isProcessed = pqr.isPresent() && pqr.get().getIsProcessed();
        String result = isProcessed ? "Felicidades tu PQR ha sido procesada" : "Lo sentimos tu PQR no fue admitida";
        String file = isProcessed?ACCEPTED_FILE:REJECTED_FILE;
        System.out.println("Enviado correo");
        emailService.sendEmail(email,SUBJECT,result, file);
    }
}
