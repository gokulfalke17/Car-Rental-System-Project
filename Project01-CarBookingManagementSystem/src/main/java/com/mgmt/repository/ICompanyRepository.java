package com.mgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mgmt.entity.Company;

@Repository
public interface ICompanyRepository extends JpaRepository<Company, Integer> {}
