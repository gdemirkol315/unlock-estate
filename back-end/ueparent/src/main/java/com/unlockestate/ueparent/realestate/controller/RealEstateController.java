package com.unlockestate.ueparent.realestate.controller;

import com.unlockestate.ueparent.exception.InternalServerRuntimeException;
import com.unlockestate.ueparent.realestate.dto.RealEstate;
import com.unlockestate.ueparent.realestate.service.RealEstateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/realEstate")
@RestController
public class RealEstateController {

    private RealEstateService realEstateService;

    private static final Logger logger = LoggerFactory.getLogger(RealEstateController.class);


    @Autowired
    public RealEstateController(RealEstateService realEstateService) {
        this.realEstateService = realEstateService;
    }

    @PostMapping("/save")
    public ResponseEntity<RealEstate> saveRealEstate(@RequestBody RealEstate realEstate) {
        try {
            return ResponseEntity.ok(realEstateService.saveRealEstate(realEstate));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not save real estate {}", realEstate.getName());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<RealEstate>> allRealEstate() {
        try {
            return ResponseEntity.ok(realEstateService.getAllRealEstates());
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get real estates");
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/getRealEstate")
    public ResponseEntity<RealEstate> getRealEState(@RequestParam String id){
        try {
            return ResponseEntity.ok(realEstateService.getRealEstate(id));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get real estate {}", id);
            return ResponseEntity.internalServerError().build();
        }
    }

}
