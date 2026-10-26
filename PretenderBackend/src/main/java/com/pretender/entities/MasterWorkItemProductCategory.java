package com.pretender.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "master_work_item_product_category")
public class MasterWorkItemProductCategory extends MasterEntity {
    public MasterWorkItemProductCategory() {}
}

