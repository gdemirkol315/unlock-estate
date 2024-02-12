package com.unlockestate.ueparent.realestates.controller;

import com.unlockestate.ueparent.utils.dto.MessageEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RealEstateController {

    @GetMapping("/allRealEstates")
    public ResponseEntity<MessageEntity> allRealEstate(){
        return ResponseEntity.ok(new MessageEntity("Real Estate 1,2,3,4"));
    }

}
