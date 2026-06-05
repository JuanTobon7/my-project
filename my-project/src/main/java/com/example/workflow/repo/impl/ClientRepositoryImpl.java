package com.example.workflow.repo.impl;

import com.example.workflow.model.Clients;
import com.example.workflow.model.JsonStore;
import com.example.workflow.repo.interf.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ClientRepositoryImpl implements ClientRepository {
    private final JsonStore jsonStore;

    @Override
    public void saveAll(List<Clients> listClients) {
        for (Clients c: listClients) {
            save(c);
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        List<Map<String, Object>> clients = jsonStore.getAll("clients");
        System.out.println("clients: "+clients);
        return clients.stream()
                .anyMatch(c -> Objects.equals(
                        ((String) c.get("email")), email
                ));
    }

    @Override
    public Optional<Clients> findByNumberPhone(Long number) {
        List<Map<String, Object>> clients = jsonStore.getAll("clients");
        return clients.stream()
                .map(Clients::fromMap)
                .filter(c-> c.getPhone().equals(number))
                .findFirst();
    }

    @Override
    public void save(Clients client) {
        jsonStore.save(
                client.toMap(),
                client.getPhone().toString(),
                "clients");
    }
}
