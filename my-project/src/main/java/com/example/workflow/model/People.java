package com.example.workflow.model;

import java.util.Map;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class People {
    protected final String name;
    protected final String lastName;
    protected final String email;
    protected final Long phone;

    public static People fromMap(Map<String, Object> map) {
        return People.builder()
                .name((String) map.get("name"))
                .lastName((String) map.get("last_name"))
                .email((String) map.get("email"))
                .phone(((Number) map.get("phone")).longValue())
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
