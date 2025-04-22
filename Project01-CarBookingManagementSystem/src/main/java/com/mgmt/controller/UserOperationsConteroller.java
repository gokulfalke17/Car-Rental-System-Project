package com.mgmt.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mgmt.entity.Admin;
import com.mgmt.entity.LoginRequest;
import com.mgmt.entity.ResetPasswordRequest;
import com.mgmt.entity.User;
import com.mgmt.service.IUserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserOperationsConteroller {

    @Autowired
    private IUserService userService;

    // http://localhost:4041/api/users/register
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }
    
    @PostMapping("/admin")
    public Admin registerAdmin(@RequestBody Admin admin) {
    	return userService.registerAdmin(admin);
    }

    // http://localhost:4041/api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

	/* // http://localhost:4041/api/users/login
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Admin admin) {
	    Admin exitingUser = userService.login(admin.getEmail(), admin.getPassword());
	    if (exitingUser != null) {
	        return ResponseEntity.ok(exitingUser);
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid Email and Password");
	    }
	}*/
    
	/* @PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
	    String role = loginRequest.getRole();
	
	    if ("admin".equalsIgnoreCase(role)) {
	 
	        Admin admin = userService.loginAsAdmin(loginRequest.getEmail(), loginRequest.getPassword());
	        
	        if (admin != null) {
	            return ResponseEntity.ok(admin);
	        }
	    } else if ("customer".equalsIgnoreCase(role)) {
	        User user = userService.loginAsCustomer(loginRequest.getEmail(), loginRequest.getPassword());
	        if (user != null) {
	            return ResponseEntity.ok(user);
	        }
	    }
	
	    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Credentials or Role");
	}*/
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String role = loginRequest.getRole();

        if ("admin".equalsIgnoreCase(role)) {
            Admin admin = userService.loginAsAdmin(loginRequest.getEmail(), loginRequest.getPassword());

            if (admin != null) {
                Map<String, Object> response = new HashMap<String, Object>();
                response.put("user", admin);
                response.put("role", "admin");
                return ResponseEntity.ok(response);
            }
        } else if ("customer".equalsIgnoreCase(role)) {
            User user = userService.loginAsCustomer(loginRequest.getEmail(), loginRequest.getPassword());

            if (user != null) {
                Map<String, Object> response = new HashMap<String, Object>();
                response.put("user", user);
                response.put("role", "customer");
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Credentials or Role");
    }
    
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String email) {
        User user = userService.getUserByEmail(email);
//        System.out.println(user.getEmail());
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
    
    @GetMapping("/forgot-password")
    public ResponseEntity<String> forgotUserPassword(@RequestParam String email) {
        String response = userService.forgotUserPassword(email);
        if (response.startsWith("Password Reset Link")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok("Password Updated Successfully...");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error Updating Password");
        }
    }

}
