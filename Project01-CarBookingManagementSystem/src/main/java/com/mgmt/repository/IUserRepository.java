package com.mgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mgmt.entity.User;

@Repository
public interface IUserRepository extends JpaRepository<User, Integer>{
	public  boolean existsByEmail(String email);
	public User findByEmail(String email);
	

}
