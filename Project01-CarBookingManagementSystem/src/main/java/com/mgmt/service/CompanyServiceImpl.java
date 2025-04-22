package com.mgmt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mgmt.entity.Company;
import com.mgmt.repository.ICompanyRepository;

@Service
public class CompanyServiceImpl implements ICompanyService{

	@Autowired
	private ICompanyRepository companyRepository;
	
	//get all companies
	@Override
	public List<Company> getAllCompanies() {
		return companyRepository.findAll();
	}
	
	//add new comapny
	@Override
	public Company addCompany(Company company) {
		return companyRepository.save(company);
	}

}
