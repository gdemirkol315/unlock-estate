package com.unlockestate.ueparent.realestate.repository;

import com.unlockestate.ueparent.realestate.dto.RealEstate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RealEstateRepository extends JpaRepository<RealEstate, Integer> {
}
