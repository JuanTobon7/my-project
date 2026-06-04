package com.example.workflow.processes;

import com.example.workflow.model.PQR;
import com.example.workflow.model.JsonStore;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component("MarkPqrProcessed")
public class MarkPqrProcessed implements JavaDelegate {
    private final JsonStore jsonStore;
    public MarkPqrProcessed(JsonStore jsonStore) {
        this.jsonStore = jsonStore;
    }
    private static final String PQR_PROCESSED = "pqr_processed";

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        Map<String, Object> pqrMap = jsonStore.getLatest(PQR_PROCESSED);
        PQR pqr = PQR.fromMap(pqrMap);
        pqr.setIsProcessed(true);
        jsonStore.save(pqr.toMap(),pqr.getId().toString(),PQR_PROCESSED);
    }
}
