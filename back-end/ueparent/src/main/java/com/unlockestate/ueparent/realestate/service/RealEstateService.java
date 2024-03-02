package com.unlockestate.ueparent.realestate.service;

import com.unlockestate.ueparent.realestate.dto.RealEstate;
import com.unlockestate.ueparent.realestate.repository.RealEstateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RealEstateService {


    private final RealEstateRepository realEstateRepository;

    public RealEstateService(RealEstateRepository realEstateRepository) {
        this.realEstateRepository = realEstateRepository;
    }

    public RealEstate saveRealEstate(RealEstate realEstate){
        return this.realEstateRepository.save(realEstate);
    }

    public RealEstate updateRealEstate(RealEstate realEstate){


        return realEstateRepository.save(realEstate);
    }


    public List<RealEstate> getAllRealEstates() {
        return realEstateRepository.findAll();
    }
}
