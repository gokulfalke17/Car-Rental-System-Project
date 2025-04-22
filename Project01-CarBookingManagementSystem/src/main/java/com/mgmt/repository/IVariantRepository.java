package com.mgmt.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mgmt.entity.Variant;

@Repository
public interface IVariantRepository extends JpaRepository<Variant, Integer>{
	public Page<Variant> findAll(Pageable pageable);
}
