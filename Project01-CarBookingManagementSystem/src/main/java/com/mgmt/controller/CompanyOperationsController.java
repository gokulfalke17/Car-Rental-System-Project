package com.mgmt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mgmt.entity.Company;
import com.mgmt.service.ICompanyService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/companies")
public class CompanyOperationsController {

	@Autowired
	private ICompanyService companyService;

	//get all companies
	
	//http://localhost:4041/api/companies
	@GetMapping
	public List<Company> getAllCompanies() {
		return companyService.getAllCompanies();
	}
	
	//add new company

	//http://localhost:4041/api/companies
	@PostMapping
	public Company addCompany(@RequestBody Company company) {
		System.err.println(company);
		return companyService.addCompany(company);
	}

}
