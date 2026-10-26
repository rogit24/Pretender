package com.pretender.repositories;

import com.pretender.entities.Tender;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenderRepository extends JpaRepository<Tender, Long> {}
