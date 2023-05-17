package com.planisa.covid.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planisa.covid.models.Covid;

public interface CovidRepository extends JpaRepository<Covid, Long>{
	
	Covid findById(long id);
	
}
