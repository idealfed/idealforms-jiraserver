package com.idealfed.api.rest;

import javax.xml.bind.annotation.*;

@XmlRootElement(name = "Ticket")
@XmlAccessorType(XmlAccessType.FIELD)
public class Ticket {

  @XmlElement(name = "ticket")
  private String ticket;


  public Ticket() {
    this.ticket = "tbd";
  }

  public Ticket(String ticket) {
    this.ticket=ticket;
  }

  public String getTicket() {
    return ticket;
  }

  public void setTicket(String ticket) {
    this.ticket = ticket;
  }

  public String serialize() {
    return "{\"ticket\":\"" + this.ticket + "\"}";
  }

}