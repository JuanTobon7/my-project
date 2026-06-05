package com.example.workflow.repo.interf;

import com.example.workflow.model.Clients;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ClientRepository {
    void saveAll(List<Clients> client);
    boolean existsByEmail(String email);
    Optional<Clients> findByNumberPhone(Long number);
    void save(Clients client);
}
