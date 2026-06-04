package com.example.workflow.repo.impl;

import com.example.workflow.model.JsonStore;
import com.example.workflow.model.PQR;
import com.example.workflow.repo.interf.PqrRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class PqrRepositoryImpl implements PqrRepository {
    private final JsonStore jsonStore;

    @Override
    public List<PQR> findByClientEmail(String email) {
        List<Map<String, Object>> allPqr = jsonStore.getAll("pqr_processed");
        return allPqr.stream()
                .map(PQR::fromMap)
                .filter(pqr -> pqr.getEmail().equals(email))
                .toList();
    }

    @Override
    public PQR getById(UUID id) {
        List<Map<String, Object>> allPqr = jsonStore.getAll("pqr_processed");
        return allPqr.stream()
                    .map(PQR::fromMap)
                    .filter(pqr -> pqr.getId().equals(id))
                    .findFirst().orElse(null);
    }

    @Override
    public PQR getLastByEmail(String email) {
        List<Map<String, Object>> allPqr = jsonStore.getAll("pqr_processed");
        // más reciente primero
        return allPqr.stream()
                .map(PQR::fromMap)
                .filter(pqr -> pqr.getEmail().equals(email)).min(Comparator.comparing(
                        PQR::getProgationDate,
                        Comparator.nullsLast(Comparator.reverseOrder()) // más reciente primero
                ))
                .orElseThrow(() -> new RuntimeException("No hay PQR para el email: " + email));
    }
}
