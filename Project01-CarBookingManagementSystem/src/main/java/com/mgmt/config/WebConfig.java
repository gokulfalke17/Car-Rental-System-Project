package com.mgmt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        Path uploadDir = Paths.get("D:/Workspaces/Company_Tasks(Projects)/Car_Rent_System/Project01-CarBookingManagementSystem/");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/**")
        	.addResourceLocations("file:D:/Workspaces/Company_Tasks(Projects)/Car_Rent_System/Project01-CarBookingManagementSystem/");
    }
}
