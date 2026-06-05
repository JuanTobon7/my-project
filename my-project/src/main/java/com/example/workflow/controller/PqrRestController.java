package com.example.workflow.controller;

import com.example.workflow.dto.StartPqrRequest;
import com.example.workflow.model.PQR;
import com.example.workflow.service.interf.ClientService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/pqr")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}
)
public class PqrRestController {
    private final ClientService clientService;
    private final TaskService taskService;
    private final RuntimeService runtimeService;

    @PostMapping("/start")
    public ResponseEntity<?> startPqrProcess(@RequestBody StartPqrRequest request) {

        Boolean existence = clientService.getExistenceByEmail(request.email());

        Map<String, Object> variables = Map.of(
                "client_pqr",             request.pqrType().toString(),
                "client_pqr_description", request.description(),
                "client_in_system",       existence,
                "client_email",           request.email()
        );

        // ← usar correlateMessage en vez de startProcessInstanceByKey
        var instance = runtimeService.startProcessInstanceByKey(
                "process_pqr_ambient",
                variables
        );
        System.out.println("instancia "+ instance.getId());
        if (!existence) {
            System.out.println("PQR iniciada a proximacion con instance id: " + instance.getId());

            // ✅ Query the active task for this process instance
            Task task = (Task) taskService.createTaskQuery()
                    .processInstanceId(instance.getId())
                    .singleResult();

            if (task == null) {
                // The process may have already completed this step automatically
                // (e.g. via a service task or gateway), so only complete if a task exists
                System.out.println("No active user task found for instance: " + instance.getId());
            } else {
                taskService.complete(task.getId(), variables); // ✅ Use task.getId()
                System.out.println("Task completed: " + task.getId());
            }

            System.out.println("PQR iniciada correctamente con instance id: " + instance.getId());
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Lo sentimos, no perteneces a nuestro sistema"));
        }

        System.out.println("PQR iniciada correctamente con instance id: "+ instance.getId());
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
        System.out.println(pqr);
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
