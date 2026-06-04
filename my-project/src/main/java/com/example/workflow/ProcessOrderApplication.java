package com.example.workflow;

import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableProcessApplication
public class ProcessOrderApplication {

  public static void main(String[] args) {
    SpringApplication.run(ProcessOrderApplication.class, args);
  }
}

