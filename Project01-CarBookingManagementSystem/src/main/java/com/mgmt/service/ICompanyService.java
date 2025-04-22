package com.mgmt.service;

import java.util.List;

import com.mgmt.entity.Company;

public interface ICompanyService {
	public  List<Company> getAllCompanies();
	public Company addCompany(Company company);
}
