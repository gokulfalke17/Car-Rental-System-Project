package com.mgmt.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	//crateing bean for password encrepting
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	//providing access to our project perticular folders through security
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.cors(Customizer.withDefaults()).csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.POST, "/api/variant/save")
						.permitAll()
						.requestMatchers(
								"/**",
								"/api/users/**",
								"/api/variant/**",
								"/api/companies/**",
								"/imgs/**",
								"/api/variant/vehicle/delete/**"
								).permitAll()
						.anyRequest()
						.authenticated())
						.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}
}
