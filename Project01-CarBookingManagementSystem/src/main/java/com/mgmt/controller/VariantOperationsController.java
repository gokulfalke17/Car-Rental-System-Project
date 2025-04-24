package com.mgmt.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mgmt.entity.Variant;
import com.mgmt.entity.Vehicle;
import com.mgmt.service.IVariantService;

@RestController
@CrossOrigin(origins = "http://localhost:5173") 
@RequestMapping("/api/variant")
public class VariantOperationsController {

	@Autowired
	private IVariantService variantService;

	/*// add variant
	@PostMapping("/save")
	public ResponseEntity<?> addVariant(@RequestPart("variant") String variantJson,
			@RequestPart("imageUrl") MultipartFile file) throws IOException {
	
		ObjectMapper objectMapper = new ObjectMapper();
		Variant variant = objectMapper.readValue(variantJson, Variant.class);
	
		String fileName = file.getOriginalFilename();
		file.transferTo(new File(
				"D:\\Workspaces\\Company_Tasks(Projects)\\Car_Rent_System\\Project01-CarBookingManagementSystem\\src\\main\\resources\\imgs\\"
						+ fileName));
		variant.setImageUrl(fileName);
	
		Variant savedVariant = variantService.addVariant(variant);
		return ResponseEntity.ok(savedVariant);
	}*/
	
	@PostMapping("/save")
	public ResponseEntity<?> addVariant(
	    @RequestPart("variant") String variantJson,
	    @RequestPart("image") MultipartFile file) throws IOException {
	    
	    ObjectMapper objectMapper = new ObjectMapper();
	    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

	    Variant variant = objectMapper.readValue(variantJson, Variant.class);

	    String fileName = file.getOriginalFilename();
	    file.transferTo(new File("YOUR_FILE_PATH_HERE" + fileName));
	    variant.setImageUrl(fileName);

	    Variant savedVariant = variantService.addVariant(variant);
	    return ResponseEntity.ok(savedVariant);
	}


	// adding backend pagination
	@GetMapping("/all")
	public ResponseEntity<Page<Variant>> getAllVariants(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "3") int size) {

		PageRequest pageable = PageRequest.of(page, size);
		Page<Variant> pagedVariants = variantService.getAllVariants(pageable);
		return ResponseEntity.ok(pagedVariants);
	}

	// http://localhost:4041/api/variant/{id}
	@GetMapping("/{id}")
	public ResponseEntity<Variant> getVariantById(@PathVariable Integer id) {
		Variant variant = variantService.getVariantById(id);
		return variant != null ? ResponseEntity.ok(variant) : ResponseEntity.notFound().build();
	}

	// http://localhost:4041/api/variant/update/{id}
	@PostMapping("/update/{id}")
	public ResponseEntity<String> updateVariant(@PathVariable Integer id, @RequestPart("variant") String variantJson,
			@RequestPart(name = "imageUrl", required = false) MultipartFile file) throws IOException {

		ObjectMapper objectMapper = new ObjectMapper();
		Variant updatedData = objectMapper.readValue(variantJson, Variant.class);

		if (file != null && !file.isEmpty()) {
			String fileName = file.getOriginalFilename();
			file.transferTo(new File(
					"D:\\Workspaces\\Company_Tasks(Projects)\\Car_Rent_System\\Project01-CarBookingManagementSystem\\src\\main\\resources\\imgs\\"
							+ fileName));
			updatedData.setImageUrl(fileName);
		}

		variantService.updateVariant(id, updatedData);
		return ResponseEntity.ok("Varient Updated Successfully...");
	}

	// http://localhost:4041/api/variant/delete/{id}
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteVariant(@PathVariable Integer id) {
		variantService.deleteVariant(id);
		return ResponseEntity.ok().build();
	}

	// http://localhost:4041/api/variant/3/vehicles
	@GetMapping("/{variantId}/vehicles")
	public ResponseEntity<List<Vehicle>> getVehiclesByVariant(@PathVariable Integer variantId) {
		List<Vehicle> vehicles = variantService.getVehiclesByVariantId(variantId);
		return ResponseEntity.ok(vehicles);
	}

	/*//http://localhost:4041/api/variant/3/add-vehicle?registrationNumber=MH22YZ9984
	@PostMapping("/{variantId}/add-vehicle")
	public ResponseEntity<Vehicle> addVehicleToVariant(@PathVariable Integer variantId,
			@RequestParam String registrationNumber) {
	
		Vehicle vehicle = variantService.addVehicleToVariant(variantId, registrationNumber);
		return ResponseEntity.ok(vehicle);
	}*/

	@PostMapping("/{variantId}/add-vehicle")
	public ResponseEntity<Vehicle> addVehicleToVariant(@PathVariable Integer variantId,
			@RequestParam String registrationNumber, @RequestParam String status) {

		Vehicle vehicle = variantService.addVehicleToVariant(variantId, registrationNumber, status);
		return ResponseEntity.ok(vehicle);
	}

	// http://localhost:4041/api/variant/vehicle/{vahicleId}
	@GetMapping("/vehicle/{vehicleId}")
	public ResponseEntity<Vehicle> getVehicleById(@PathVariable Integer vehicleId) {
		Vehicle vehicle = variantService.getVehicleById(vehicleId);
		return vehicle != null ? ResponseEntity.ok(vehicle) : ResponseEntity.notFound().build();
	}

	@DeleteMapping("/vehicle/delete/{vehicleId}")
	public ResponseEntity<String> deleteVehicleById(@PathVariable Integer vehicleId) {
		variantService.deleteVehicleById(vehicleId);
		return new ResponseEntity<String>("Vehicle Deleted Successfully", HttpStatus.OK);
	}

	@GetMapping("/all-variants")
	public ResponseEntity<List<Variant>> getAllVehicles() {
		List<Variant> allVehicles = variantService.getAllVehicles();
		return new ResponseEntity<List<Variant>>(allVehicles, HttpStatus.OK);
	}

}

/*	
	{
    "variantName": "punch",
    "variantDesc":"Stylish compact SUV",
    "company":{
         "id": 2,
        "companyName": "tata"

    },
    "modelNumber":"pubch1242",
    "year":2023,
    "fuelType":"petrol",
    "isAc":true,
    "seatCapacity":5,
    "rentPerDay":3000,
   "imageUrl":"car.jpg"

}
*/
