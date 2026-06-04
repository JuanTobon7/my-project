package com.example.workflow.dto;

import com.example.workflow.model.PqrType;

public record StartPqrRequest(
        PqrType pqrType,
        String description,
        String email
) {}