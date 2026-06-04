package com.example.workflow.repo.interf;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ClientRepository {
    void saveAll(List<Map<String, Object>> client);
    boolean existsByEmail(String email);
    Optional<Map<String, Object>> findByNumberPhone(Long number);
}
