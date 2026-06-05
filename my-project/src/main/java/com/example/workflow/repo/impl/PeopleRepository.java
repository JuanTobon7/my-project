package com.example.workflow.repo.impl;

import com.example.workflow.model.JsonStore;
import com.example.workflow.model.People;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PeopleRepository {
    private final JsonStore jsonStore;

    public void save(People p) {
        jsonStore.save(p.toMap(), p.getPhone().toString(),"employements");
    }

    public List<People> findAll() {
        return jsonStore.getAll("employements").stream().map(People::fromMap).toList();
    }

    public People findByPhone(Long phone) {
        return findAll().stream()
                .filter(p -> p.getPhone().equals(phone))
                .findFirst().orElse(null);
    }

}
