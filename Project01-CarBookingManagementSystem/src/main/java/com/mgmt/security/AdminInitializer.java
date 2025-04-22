package com.mgmt.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.mgmt.entity.Admin;
import com.mgmt.repository.IAdminRepository;

//adding one default admin into server or database (Using CLR-> Command Line Runner)
@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private IAdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@gmail.com";
        String password = "admin@123";

        Admin existingAdmin = adminRepository.findByEmail(adminEmail);

        if (existingAdmin == null) { 
            Admin admin = new Admin();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(password));
            adminRepository.save(admin);
            System.out.println("Default Admin Created :: " + adminEmail);
        } else {
            System.out.println("Admin already exists :: " + existingAdmin.getEmail());
        }
    }
}
