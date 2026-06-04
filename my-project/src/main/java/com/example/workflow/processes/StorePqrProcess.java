package com.example.workflow.processes;

import com.example.workflow.model.JsonStore;
import com.example.workflow.model.PQR;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("StorePqrProcess")
public class StorePqrProcess implements JavaDelegate {
    private final JsonStore jsonStore;

    public StorePqrProcess(JsonStore jsonStore) {
        this.jsonStore = jsonStore;
    }
    private static final String PQR_PROCESSED = "pqr_processed";

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String clientName = (String) delegateExecution.getVariable("client_name");
        String clientLastName = (String) delegateExecution.getVariable("client_last_name");
        String clientPqr = (String) delegateExecution.getVariable("client_pqr");
        String clientPqrDescription = (String) delegateExecution.getVariable("client_pqr_description");
        Number clientPhoneNum = (Number) delegateExecution.getVariable("client_phone");
        String email = (String) delegateExecution.getVariable("email");
        Long clientPhone = clientPhoneNum.longValue();
        UUID id = UUID.randomUUID();
        PQR pqr = PQR.builder()
                .id(id)
                .pqr(clientPqr)
                .description(clientPqrDescription)
                .clientName(clientName)
                .clientLastName(clientLastName)
                .clientPhone(clientPhone)
                .email(email)
                .build();
        jsonStore.save(pqr.toMap(), (String) pqr.toMap().get("id"), PQR_PROCESSED);
    }
}
