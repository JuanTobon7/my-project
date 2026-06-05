package com.example.workflow.repo.interf;

import com.example.workflow.model.PQR;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface PqrRepository {
    List<PQR> findByClientEmail(String email);
    PQR getById(UUID id);
    Optional<PQR> getLastByEmail(String email);
}
