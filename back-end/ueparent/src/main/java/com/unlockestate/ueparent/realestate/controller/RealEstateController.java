package com.unlockestate.ueparent.realestate.controller;

import com.unlockestate.ueparent.exception.InternalServerRuntimeException;
import com.unlockestate.ueparent.realestate.dto.RealEstate;
import com.unlockestate.ueparent.realestate.service.RealEstateService;
import com.unlockestate.ueparent.user.controller.UserController;
import com.unlockestate.ueparent.utils.dto.MessageEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/realEstate")
@RestController
public class RealEstateController {

    private RealEstateService realEstateService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);


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
    public ResponseEntity<MessageEntity> allRealEstate() {
        return ResponseEntity.ok(new MessageEntity("Real Estate 1,2,3,4"));
    }

}
