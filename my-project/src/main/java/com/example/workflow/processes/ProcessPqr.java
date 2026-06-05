package com.example.workflow.processes;

import com.example.workflow.model.PqrType;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component("ProcessPqr")
public class ProcessPqr implements JavaDelegate {

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String clientPqr = (String) delegateExecution.getVariable("client_pqr");
        boolean pqrType = isValid(clientPqr);
        delegateExecution.setVariable("pqr_valid", pqrType);
        String pqrTypeClassified = classifyPQR(clientPqr);
        delegateExecution.setVariable("pqr_type_classified", pqrTypeClassified);
    }

    private boolean isValid(String clientPqr) {
        if (clientPqr == null || clientPqr.isEmpty()) {
            return false;
        }
        PqrType pqrType = PqrType.valueOf(clientPqr.toUpperCase().trim());
        return switch (pqrType) {
            case PETICION -> true;
            case QUEJA -> true;
            case RECLAMO -> true;
            case PREGUNTA -> false;
            default -> false;
        };
    }

    private String classifyPQR(String clientPqr){
        PqrType pqrType = PqrType.valueOf(clientPqr.toUpperCase().trim());
        return switch (pqrType){
            case PETICION -> "tecnico"; //PETICION
            case QUEJA  -> "tecnico"; //QUEJA
            case RECLAMO -> "comercial"; //RECLAMO
            default -> "tecnico";
        };
    }
}