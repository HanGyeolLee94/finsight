package com.finsight.lab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableScheduling
public class FinsightApplication {

	public static void main(String[] args) {
		// ✅ Spring Boot 시작 전에 환경 변수 로드
		Dotenv dotenv = Dotenv.load();
		dotenv.entries().forEach(entry -> {
			if (System.getenv(entry.getKey()) == null) {
				System.setProperty(entry.getKey(), entry.getValue());
			}
		});

		// ✅ Spring Boot 애플리케이션 실행
		SpringApplication.run(FinsightApplication.class, args);
	}
}
