package com.example.workflow.service.interf;

import com.example.workflow.model.PQR;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ClientService {
    Map<String, Object> getClientByPhone(Long phone);
    Boolean getExistenceByEmail(String email);
    List<PQR> getPqrByClientEmail(String email);
    String getResult(UUID id);
}
