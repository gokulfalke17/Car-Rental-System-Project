package com.mgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mgmt.entity.Admin;

public interface IAdminRepository extends JpaRepository<Admin, Integer> {
    Admin findByEmailAndPassword(String email, String password);
    public  Admin findByEmail(String email);
}