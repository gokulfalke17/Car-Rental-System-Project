//package com.mgmt.controller;
//
//import java.util.Optional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.mgmt.entity.License;
//import com.mgmt.entity.User;
//import com.mgmt.service.ILicenseService;
//
//@Controller
//@RequestMapping("/api/license")
//@CrossOrigin(origins = "http://localhost:5173")
//public class LicenseController {
//
//    @Autowired
//    private ILicenseService licenseService;
//
//    @PostMapping("/add")
//    public ResponseEntity<License> registerLicense(
//            @RequestParam("licenseNumber") String licenseNumber,
//            @RequestParam("expiryDate") String expiryDate,
//            @RequestParam("licensePhoto") MultipartFile licensePhoto,
//            @RequestParam("userId") String userIdStr) {
//
//        try {
//            // Validate and parse userId
//            if (userIdStr == null || userIdStr.trim().isEmpty()) {
//                return ResponseEntity.badRequest().body(null);
//            }
//            Integer userId = Integer.parseInt(userIdStr);
//
//            // Get file name (you can save the actual file to disk or DB as needed)
//            String fileName = licensePhoto.getOriginalFilename();
//
//            // Create License object
//            License license = new License();
//            license.setLicenseNumber(licenseNumber);
//            license.setExpiryDate(expiryDate);
//            license.setLicensePhoto(fileName);
//
//            // Associate with user
//            User user = new User();
//            user.setUserId(userId);
//            license.setUser(user);
//
//            License savedLicense = licenseService.addLicense(license);
//            return ResponseEntity.ok(savedLicense);
//
//        } catch (NumberFormatException e) {
//            return ResponseEntity.badRequest().body(null);
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().body(null);
//        }
//    }
//
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<Optional<License>> getLicenseByUserId(@PathVariable Integer userId) {
//        Optional<Optional<License>> licenseOpt = licenseService.getLicenseByUserId(userId);
//        return licenseOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//}

package com.mgmt.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.mgmt.entity.License;
import com.mgmt.entity.User;
import com.mgmt.repository.IUserRepository;
import com.mgmt.service.ILicenseService;

@Controller
@RequestMapping("/api/license")
@CrossOrigin(origins = "http://localhost:5173") 
public class LicenseController {

	@Autowired
	private ILicenseService licenseService;

	@Autowired
	private IUserRepository userRepository;

	@PostMapping("/add")
	public ResponseEntity<?> registerLicense(@RequestParam("licenseNumber") String licenseNumber,
			@RequestParam("expiryDate") String expiryDate, @RequestParam("licensePhoto") MultipartFile licensePhoto,
			@RequestParam("userId") String userIdStr) {

		try {
			if (userIdStr == null || userIdStr.trim().isEmpty()) {
				return ResponseEntity.badRequest().body("User ID is missing");
			}

			Integer userId = Integer.parseInt(userIdStr);

			Optional<User> userOptional = userRepository.findById(userId);
			if (userOptional.isEmpty()) {
				return ResponseEntity.badRequest().body("User not found with ID: " + userId);
			}

			String uploadDir = "uploads/imgs/";
			Path uploadPath = Paths.get(uploadDir);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			String fileName = licensePhoto.getOriginalFilename();
			Path filePath = uploadPath.resolve(fileName);
			Files.copy(licensePhoto.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

			License license = new License();
			license.setLicenseNumber(licenseNumber);
			license.setExpiryDate(expiryDate);
			license.setLicensePhoto(fileName);
			license.setUser(userOptional.get());

			License savedLicense = licenseService.addLicense(license);
			return ResponseEntity.ok(savedLicense);

		} catch (NumberFormatException e) {
			return ResponseEntity.badRequest().body("Invalid user ID format");
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("Error saving license");
		}
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<Optional<License>> getLicenseByUserId(@PathVariable Integer userId) {
		Optional<Optional<License>> licenseOpt = licenseService.getLicenseByUserId(userId);
		return licenseOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	
	@PutMapping("/update/{licenseId}")
	public ResponseEntity<?> updateLicense(
	        @PathVariable Integer licenseId,
	        @RequestParam("licenseNumber") String licenseNumber,
	        @RequestParam("expiryDate") String expiryDate,
	        @RequestParam(value = "licensePhoto", required = false) MultipartFile licensePhoto
	) {
	    try {
	        Optional<License> licenseOptional = licenseService.getLicenseById(licenseId);
	        if (licenseOptional.isEmpty()) {
	            return ResponseEntity.badRequest().body("License not found");
	        }

	        License license = licenseOptional.get();
	        license.setLicenseNumber(licenseNumber);
	        license.setExpiryDate(expiryDate);

	        if (licensePhoto != null && !licensePhoto.isEmpty()) {
	            String uploadDir = "uploads/imgs/";
	            Path uploadPath = Paths.get(uploadDir);
	            if (!Files.exists(uploadPath)) {
	                Files.createDirectories(uploadPath);
	            }

	            String fileName = licensePhoto.getOriginalFilename();
	            Path filePath = uploadPath.resolve(fileName);
	            Files.copy(licensePhoto.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
	            license.setLicensePhoto(fileName);
	        }

	        License updatedLicense = licenseService.updateLicense(license);
	        return ResponseEntity.ok(updatedLicense);
	    } catch (Exception e) {
	        return ResponseEntity.internalServerError().body("Failed to update license");
	    }
	}
	
}
