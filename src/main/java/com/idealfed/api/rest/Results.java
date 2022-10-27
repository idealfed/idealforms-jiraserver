package com.idealfed.api.rest;

import javax.xml.bind.annotation.*;

@XmlRootElement(name = "Results")
@XmlAccessorType(XmlAccessType.FIELD)
public class Results {

    @XmlElement(name = "results")
    private String results;


    public Results() {
        this.results = "tbd";
    }

    public Results(String results) {
        this.results=results;
    }

    public String getResults() {
        return this.results;
    }

    public void setResults(String results) {
        this.results = results;
    }

    public String serialize() {
        return this.results;
    }

}