package com.mgmt.config;

import org.springframework.context.annotation.Configuration;

import org.springframework.web.servlet.config.annotation.*;

//conning frantend and backend through this class
@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
	    registry.addMapping("/**")
	            .allowedOrigins("http://localhost:3000", "http://localhost:5173")
	            .allowedMethods("*")
	            .allowedHeaders("*")
	            .allowCredentials(true);
	}
	
	//adding images to server
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/imgs/**").addResourceLocations("classpath:/imgs/");
	}

}
