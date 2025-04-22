package com.mgmt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mgmt.entity.License;

@Repository
public interface ILicenseRepository extends JpaRepository<License, Integer> {
    License findByIdAndUserEmail(Integer id, String userEmail);
    boolean existsByUserUserId(Integer userId);
    Optional<License> findByUserUserId(Integer userId);
}
