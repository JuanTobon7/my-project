package com.example.workflow.model;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.util.Map;

@SuperBuilder
@Getter
public class Clients extends People {
    public static Clients fromMap(Map<String, Object> map) {
        return Clients.builder()
                .name((String) map.get("name"))
                .lastName((String) map.get("last_name"))
                .email((String) map.get("email"))
                .phone((Long) map.get("phone"))
                .build();
    }
}
