package com.lifelink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * LifeLink - Smart Blood Donor and Emergency Blood Request Management System
 * Main application entry point.
 */
@SpringBootApplication
@EnableAsync
public class LifeLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(LifeLinkApplication.class, args);
    }
}
