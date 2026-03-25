package com.crm;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrmApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
            if (entry.getKey().startsWith("DB_")) {
                System.out.println("Loaded ENV: " + entry.getKey() + " = " + (entry.getKey().contains("PASSWORD") ? "********" : entry.getValue()));
            }
        });
        
        SpringApplication.run(CrmApplication.class, args);
    }
}
