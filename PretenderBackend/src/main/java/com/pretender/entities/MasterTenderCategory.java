package com.pretender.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "master_tender_category")
public class MasterTenderCategory extends MasterEntity {
    public MasterTenderCategory() {}
}

