package com.example.workflow.controller;

import com.example.workflow.model.People;
import com.example.workflow.repo.impl.AssingmentsRepository;
import com.example.workflow.repo.impl.PeopleRepository;
import com.example.workflow.repo.interf.ClientRepository;
import com.example.workflow.service.interf.ClientService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.RuntimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employements")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}
)
public class EmployementsRestController {
    private final PeopleRepository peopleRepository;
    private final ClientService clientService;
    private final AssingmentsRepository assingmentsRepository;
    private final RuntimeService runtimeService;

    @GetMapping
    public ResponseEntity<List<People>> getAll() {
        return ResponseEntity.ok(peopleRepository.findAll());
    }
}

