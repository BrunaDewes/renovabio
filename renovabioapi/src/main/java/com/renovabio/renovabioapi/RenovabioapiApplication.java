package com.renovabio.renovabioapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RenovabioapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(RenovabioapiApplication.class, args);
		System.out.println("API Rodando...");
	}

}
