package com.example.workflow.controller;

import com.example.workflow.dto.StartPqrRequest;
import com.example.workflow.model.PQR;
import com.example.workflow.model.PqrType;
import com.example.workflow.service.interf.ClientService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/pqr")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:3000", // React/Vite
        allowCredentials = "true"
)
public class PqrRestController {
    private final ClientService clientService;
    private final TaskService taskService;
    private final RuntimeService runtimeService;

    @PostMapping("/start")
    public ResponseEntity<?> startPqrProcess(
            @RequestBody StartPqrRequest request
            ) {

        Boolean existence = clientService.getExistenceByEmail(request.email());
        // Variables que tu ProcessPqr.java ya espera
        Map<String, Object> variables = Map.of(
                "client_pqr",             request.pqrType().toString(),
                "client_pqr_description", request.description(),
                "client_in_system", existence,
                "client_email", request.email()
        );
        var instance = runtimeService.startProcessInstanceByKey( //Arranca el proceso de Camunda con las variables requeridas
                "process_pqr_ambient",   // <-- el id="ProcessPqr" de tu .bpmn
                variables
        );
        if(!existence) return ResponseEntity.badRequest().body(
                Map.of("message","Lo sentimos, no perteneces a nuestro sistema"));
        runtimeService.setVariable(instance.getId(), "client_in_system", existence);
        return ResponseEntity.ok(Map.of(
                "instanceId",          instance.getId(),
                "processDefinitionId", instance.getProcessDefinitionId(),
                "message",             "PQR iniciada correctamente"
        ));
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePqr(
            @RequestBody PQR pqr,
            @RequestParam("task_id") String taskId
    ) {
        taskService.complete(taskId, pqr.toMap()); //Inicia StoreProcessPqr
        return ResponseEntity.ok().build();
    }

    @GetMapping("/tasks/{instanceId}")
    public ResponseEntity<?> getPendingTask(@PathVariable String instanceId) {
        var task = taskService.createTaskQuery()
                .processInstanceId(instanceId)
                .singleResult();

        if (task == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(Map.of(
                "taskId",   task.getId(),        // ← este es el que necesitas
                "taskName", task.getName(),
                "taskKey",  task.getTaskDefinitionKey()
        ));
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getAllPqr(
        @PathVariable("email") String email
    ){
        List<PQR> pqrs = clientService.getPqrByClientEmail(email);
        return ResponseEntity.ok(pqrs);
    }

    @GetMapping("/{email}/result/{id}")
    public ResponseEntity<?> getResult(
            @PathVariable("id") UUID id
    ) {
        String result = clientService.getResult(id);
        return ResponseEntity.ok(result);
    }
}
