package com.example.workflow.dto;

public record ClientRequest(
        String personName,
        String personLastName,
        Long numberPhone,
        String email
) {
}
