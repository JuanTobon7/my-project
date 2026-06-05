package com.example.workflow.service.impl;

import com.example.workflow.dto.ClientRequest;
import com.example.workflow.model.Clients;
import com.example.workflow.model.JsonStore;
import com.example.workflow.model.PQR;
import com.example.workflow.repo.interf.ClientRepository;
import com.example.workflow.repo.interf.PqrRepository;
import com.example.workflow.service.interf.ClientService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.RuntimeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final RuntimeService runtimeService;
    private final ClientRepository clientRepository;
    private final PqrRepository pqrRepository;
    private final JsonStore jsonStore;

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

    @Override
    public Clients saveClient(ClientRequest clientRequest) {
        Clients client = Clients.builder()
                .phone(clientRequest.numberPhone())
                .email(clientRequest.email())
                .name(clientRequest.personName())
                .lastName(clientRequest.personLastName())
                .build();
        clientRepository.save(client);
        return client;
    }
}
