package com.example.workflow.repo.impl;

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
    public void saveAll(List<Map<String, Object>> client) {
        for (Map<String, Object> c : client) {
            Long phone = (Long) c.get("phone");
            jsonStore.save(c,phone.toString(), "clients");
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        List<Map<String, Object>> clients = jsonStore.getAll("clients");
        return clients.stream()
                .anyMatch(c -> Objects.equals(
                        ((String) c.get("templates/email")), email
                ));
    }

    @Override
    public Optional<Map<String, Object>> findByNumberPhone(Long number) {
        List<Map<String, Object>> clients = jsonStore.getAll("clients");
        return clients.stream()
                .filter(c -> Objects.equals(
                        ((Number) c.get("phone")).longValue(), number
                ))
                .findFirst();
    }
}
