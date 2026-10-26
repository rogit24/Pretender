package com.pretender.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "master_tenderer_class")
public class MasterTendererClass extends MasterEntity {
    public MasterTendererClass() {}
}

