package com.mgmt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mgmt.entity.Admin;
import com.mgmt.entity.User;
import com.mgmt.repository.IAdminRepository;
import com.mgmt.repository.IUserRepository;

@Service
public class UserServiceImpl implements IUserService {

	@Autowired
	private IUserRepository userRepository;

	@Autowired
	private IAdminRepository adminRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public User registerUser(User user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	@Override
	public Admin registerAdmin(Admin admin) {
		return adminRepository.save(admin);
	}

	@Override
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	/*@Override
	public Admin login(String email, String password) {
	    Admin user = adminRepository.findByEmailAndPassword(email, password);
	    if (user != null && passwordEncoder.matches(password, user.getPassword())) {
	        return user;
	    }
	    return null;
	}*/

	@Override
	public Admin loginAsAdmin(String email, String password) {
		Admin admin = adminRepository.findByEmail(email);
		System.out.println("Admin :: " + admin);
		if (admin != null && passwordEncoder.matches(password, admin.getPassword())) {
			return admin;
		}
		return null;
	}

	@Override
	public User loginAsCustomer(String email, String password) {
		User user = userRepository.findByEmail(email);
		System.out.println("User :: " + user);
		if (user != null && passwordEncoder.matches(password, user.getPassword())) {
			return user;
		}
		return null;
	}

	@Override
	public User getUserByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Override
	public String forgotUserPassword(String email) {
		User user = userRepository.findByEmail(email);
		if (user == null) {
			return "User not found with email: " + email;
		}

		String resetLink = "http://localhost:3000/reset-password?email=" + email;
		return "Password Reset Link sent to " + email + ". Link: " + resetLink;
	}

	@Override
	public String resetPassword(String email, String newPassword) {
		User user = userRepository.findByEmail(email);
		if (user == null) {
			return "User Not Found with Email :: " + email;
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
		return "Password Updated Successfully...";
	}

	@Override
	public boolean deleteCustomerById(Integer userId) {
		if (userRepository.existsById(userId)) {
			userRepository.deleteById(userId);
			return true;
		}
		return false;
	}
}
