package com.planisa.covid.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.planisa.covid.models.Covid;

@Repository
public interface CovidRepository extends JpaRepository<Covid, Long>{
	
	Covid findById(long id);
	
}
