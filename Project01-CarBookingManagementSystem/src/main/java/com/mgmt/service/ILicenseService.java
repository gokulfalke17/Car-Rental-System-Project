package com.mgmt.service;

import java.util.Optional;

import com.mgmt.entity.License;

public interface ILicenseService {
    License addLicense(License license);
    Optional<License> getLicenseByIdAndUserEmail(Integer id, String userEmail);
    boolean existsByUserId(Integer userId);
    public Optional<Optional<License>> getLicenseByUserId(Integer userId);
    //public Optional<Optional<License>> getLicenseByUserId(Integer userId);
    
    public Optional<License> getLicenseById(Integer licenseId);
	public License updateLicense(License license);
	
}
