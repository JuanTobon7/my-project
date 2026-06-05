package com.example.workflow.repo.impl;

import com.example.workflow.model.JsonStore;
import com.example.workflow.model.People;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AssingmentsRepository {
    private final JsonStore jsonStore;

    private static final String ASSIGNMENTS = "assignments";

    public void save(People client, People empleyement, Date date, String area) {
        Long phoneClient = client.getPhone();
        Long phoneEmployement = empleyement.getPhone();
        Map<String, Object> assignment = Map.of(
                "client", client.toMap(),
                "employement", empleyement.toMap(),
                "date", date.toString(),
                "area", area
        );
        String id = phoneClient.toString() +"-" + phoneEmployement.toString() + "-" + date.toString();

        jsonStore.save(assignment, id ,ASSIGNMENTS);
    }
}
