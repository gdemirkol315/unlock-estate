package com.unlockestate.ueparent.realestate.repository;

import com.unlockestate.ueparent.realestate.dto.RealEstate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RealEstateRepository extends JpaRepository<RealEstate, Integer> {

    @Query(value = "select * from real_estate where is_active = 'true'", nativeQuery = true)
    Optional<List<RealEstate>> findAllActiveRealEstates();

}
