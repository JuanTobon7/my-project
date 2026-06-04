package com.example.workflow.service.impl;

import com.example.workflow.model.PQR;
import com.example.workflow.repo.interf.ClientRepository;
import com.example.workflow.repo.interf.PqrRepository;
import com.example.workflow.service.interf.ClientService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.RuntimeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final RuntimeService runtimeService;
    private final ClientRepository clientRepository;
    private final PqrRepository pqrRepository;

    @Override
    public Map<String, Object> getClientByPhone(Long phone) {
        return Map.of();
    }

    @Override
    public Boolean getExistenceByEmail(String email) {
         return clientRepository.existsByEmail(email);
    }

    @Override
    public List<PQR> getPqrByClientEmail(String email) {
        return pqrRepository.findByClientEmail(email);
    }

    @Override
    public String getResult(UUID id) {
        PQR pqr = pqrRepository.getById(id);
        return pqr.getIsProcessed()?"PQR procesada":"PQR no procesada";
    }
}
