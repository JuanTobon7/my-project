package com.example.workflow.config;

import com.example.workflow.repo.interf.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SeederClient implements CommandLineRunner {
    private final ClientRepository clientRepository;
    @Override
    public void run(String... args) throws Exception {
        List<Map<String, Object>> clients = List.of(
            Map.of(
                "name", "Juan",
                "last_name", "Tobon",
                "phone", 3212527494L,
                    "templates/email", "jctobon@gmail.com"
            ),
            Map.of(
             "name", "Carlos",
             "last_name", "Garcia",
             "phone", 123456710L,
                    "templates/email", "jhondoe@gmail.com"
            )
        );
        clientRepository.saveAll(clients);

    }
}
