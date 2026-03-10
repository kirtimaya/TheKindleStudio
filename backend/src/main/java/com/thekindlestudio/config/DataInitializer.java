package com.thekindlestudio.config;

import com.thekindlestudio.admin.Admin;
import com.thekindlestudio.admin.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeAdmins(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user already exists
            if (adminRepository.findByUsername("admin").isEmpty()) {
                // Create default admin user
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("Admin User");
                admin.setActive(true);
                
                adminRepository.save(admin);
                System.out.println("Default admin user created successfully!");
                System.out.println("Username: admin");
                System.out.println("Password: admin123");
            }
        };
    }
}
