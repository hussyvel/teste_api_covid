package com.planisa.covid.resources;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planisa.covid.models.Covid;
import com.planisa.covid.repository.CovidRepository;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;




@RestController //api rest
@RequestMapping(value="/api") //URI padrão
@Api(value="API REST Covid")
@CrossOrigin(origins="*") //libera todos os domínios da api

public class CovidResource {
	
	
	@Autowired //conectar com os métodos 
	CovidRepository covidRepository;
	
	@GetMapping("/covids/get_covids")
	@ApiOperation(value="Retorna uma lista com os Estados com cases, deaths")
	public List<Covid> listaStates(){
		return covidRepository.findAll();
	}
	
	@GetMapping("/covids/covid_id/{id}")
	@ApiOperation(value="Retorna um Estado com cases, deaths")
	public Covid listaStateUnico(@PathVariable(value="id") long id){
		return covidRepository.findById(id);
	}
	

	@PostMapping("/covids/get_covids")
	public ResponseEntity<Covid> criarCovid(@RequestBody Covid covid) {
		covid.setState("");
        Covid novoCovid = covidRepository.save(covid);
        return ResponseEntity.created(URI.create("/post_covids/" + novoCovid.getId()))
                .body(novoCovid);
    }
	
	
/*
	@PostMapping("/post_covid")
	@ApiOperation(value="Salva um Estado")
	public Covid salvarCovid(@RequestBody Covid covid) {
		return covidRepository.save(covid);
	}
*/
	

		
	@DeleteMapping("covids/delete_covid")
	@ApiOperation(value="Delete um Estado com cases, deaths")
	public void deletaCovid (@RequestBody Covid covid) {
		covidRepository.delete(covid);
	}
	
	@PutMapping("covids/update_covid")
	@ApiOperation(value="Atualiza um Estado com cases, deaths")
	public Covid atualizaCovid(@RequestBody Covid covid) {
	    return	covidRepository.save(covid);
	}
	

}
