package com.mgmt.service;

import java.util.List;
import java.util.Optional;

import com.mgmt.entity.Admin;
import com.mgmt.entity.User;

public interface IUserService {
	public User registerUser(User user);

	public Admin registerAdmin(Admin admin);

	public List<User> getAllUsers();

//	public Admin login(String email, String password);
	public Admin loginAsAdmin(String email, String password);

	public User loginAsCustomer(String email, String password);

	public User getUserByEmail(String email);

	public String forgotUserPassword(String email);

	public String resetPassword(String email, String newPassword);

	public boolean deleteCustomerById(Integer userId);
}
