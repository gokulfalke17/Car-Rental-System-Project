package com.mgmt.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mgmt.entity.License;
import com.mgmt.repository.ILicenseRepository;

@Service
public class LicenseServiceImpl implements ILicenseService {

    @Autowired
    private ILicenseRepository licenseRepository;

    @Override
    public License addLicense(License license) {
        return licenseRepository.saveAndFlush(license);
    }

    @Override
    public boolean existsByUserId(Integer userId) {
        return licenseRepository.existsByUserUserId(userId);
    }

    @Override
    public Optional<License> getLicenseByIdAndUserEmail(Integer id, String userEmail) {
        return Optional.ofNullable(licenseRepository.findByIdAndUserEmail(id, userEmail));
    }

	/*    @Override
	public Optional<Optional<License>> getLicenseByUserId(Integer userId) {
	    return Optional.ofNullable(licenseRepository.findByUserUserId(userId));
	}*/
    
    @Override
    public Optional<Optional<License>> getLicenseByUserId(Integer userId) {
        return Optional.ofNullable(licenseRepository.findByUserUserId(userId));
    }
    

    @Override
    public License updateLicense(License license) {
        return licenseRepository.save(license);
    }
    
    @Override
    public Optional<License> getLicenseById(Integer licenseId) {
        return licenseRepository.findById(licenseId);
    }
}
