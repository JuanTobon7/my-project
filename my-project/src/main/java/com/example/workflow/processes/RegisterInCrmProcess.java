package com.example.workflow.processes;

import com.example.workflow.model.Clients;
import com.example.workflow.repo.interf.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component("RegisterInCrmProcess")
@RequiredArgsConstructor
@Slf4j
public class RegisterInCrmProcess implements JavaDelegate {
    private final ClientRepository clientRepository;

    @Override
    public void execute(DelegateExecution execution) throws Exception {

            // Leer todo lo que viene del subproceso
            String personName  = (String) execution.getVariable("personName");
            String personLastName = (String) execution.getVariable("personLastName");
            String email       = (String) execution.getVariable("email");
            String phone    = (String) execution.getVariable("numberPhone");

            log.info("Procesando cliente {} con phone {}", personName, phone);

            Clients client = Clients.builder()
                    .name(personName)
                    .email(email)
                    .phone(Long.parseLong(phone))
                    .lastName(personLastName)
                    .build();
            clientRepository.save(client);
            execution.setVariable("register_person_status", Boolean.TRUE);
    }
}
