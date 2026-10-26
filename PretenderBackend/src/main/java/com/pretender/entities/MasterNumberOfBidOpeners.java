package com.pretender.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "master_number_of_bid_openers")
public class MasterNumberOfBidOpeners extends MasterEntity {
    public MasterNumberOfBidOpeners() {}
}

