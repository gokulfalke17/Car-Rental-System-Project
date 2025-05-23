package com.mgmt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mgmt.entity.Variant;
import com.mgmt.entity.VariantDetails;

@Repository
public interface IEmailRepository extends JpaRepository<Variant, Integer> {

    
	@Query(value = "SELECT V.VARIANT_NAME AS variantName, V.RENT_PER_DAY AS rentPerDay, C.COMPANY_NAME AS companyName FROM VEHICLES VEH INNER JOIN VARIANT V ON VEH.VARIANT_ID = V.VARIANT_ID INNER JOIN COMPANY C ON V.COMPANY_ID = C.ID WHERE VEH.VEHICLE_REGISTRATION_NUMBER = :carNumber", nativeQuery = true)
	public List<VariantDetails> getSpecificData(@Param("carNumber") String carNumber);

}
