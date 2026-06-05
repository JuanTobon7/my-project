package com.example.workflow.processes;

import com.example.workflow.model.Clients;
import com.example.workflow.model.People;
import com.example.workflow.repo.impl.AssingmentsRepository;
import com.example.workflow.repo.impl.PeopleRepository;
import com.example.workflow.service.interf.ClientService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component("ScheduleVisitProcess")
@RequiredArgsConstructor
public class ScheduleVisitProcess implements JavaDelegate {
    private final ClientService clientService;
    private final AssingmentsRepository assingmentsRepository;
    private final PeopleRepository peopleRepository;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String dateStr = (String) execution.getVariable("date_visit");
        String clientPhone = (String) execution.getVariable("client_phone");
        String employementPhone = (String) execution.getVariable("employement_phone");
        String area = (String) execution.getVariable("pqr_type_classified");
        Long clientPhoneLong = Long.parseLong(clientPhone);
        Long phoneEmployement = Long.parseLong(employementPhone);
        Clients clients = clientService.getClientByPhone(clientPhoneLong);
        People employement = peopleRepository.findByPhone(phoneEmployement);
        Date date = new Date(dateStr);
        assingmentsRepository.save(clients, employement, date, "Area de reparaciones");

        System.out.println("ScheduleVisitProcess");
    }
}
