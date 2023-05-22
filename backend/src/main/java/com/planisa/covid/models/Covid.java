package com.planisa.covid.models;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="TB_COVID")
public class Covid implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;
    private String state;

    public long getId() {
        return Id;
    }

    public void setId(long id) {
        Id = id;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getCases() {
        return cases;
    }

    public void setCases(Integer cases) {
        this.cases = cases;
    }

    public Integer getDeaths() {
        return deaths;
    }

    public void setDeaths(Integer deaths) {
        this.deaths = deaths;
    }

    private Integer cases;
    private Integer deaths;
}
