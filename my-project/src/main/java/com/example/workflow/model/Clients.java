package com.example.workflow.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Builder
@AllArgsConstructor
@Getter
public class Clients {
    private final String name;
    private final String lastName;
    private final String email;
    private final Long phone;

    public static Clients fromMap(Map<String, Object> map) {
        return Clients.builder()
                .name((String) map.get("name"))
                .lastName((String) map.get("last_name"))
                .email((String) map.get("email"))
                .phone((Long) map.get("phone"))
                .build();
    }

    public Map<String, Object> toMap() {
        return Map.of(
                "name", name,
                "last_name", lastName,
                "email", email,
                "phone", phone
        );
    }
}
