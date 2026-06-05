package com.example.workflow.config;

import com.example.workflow.model.People;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SeederEmployements implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        List<People> employements = List.of(
            People.builder()
                .name("Juan")
                .lastName("Perez")
                .email("perez@gmail.com")
                .phone(123456789L)
                .build(),
            People.builder()
                    .name("Carlos")
                    .lastName("Garcia")
                    .email("garcia@gmail.com")
                    .phone(123456781L)
                    .build()
        );
    }

}
