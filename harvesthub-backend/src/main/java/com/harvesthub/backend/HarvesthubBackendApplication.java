package com.harvesthub.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.harvesthub")
@EnableJpaRepositories(basePackages = "com.harvesthub.repository")
@EntityScan(basePackages = "com.harvesthub.model")
public class HarvesthubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HarvesthubBackendApplication.class, args);
    }
}

