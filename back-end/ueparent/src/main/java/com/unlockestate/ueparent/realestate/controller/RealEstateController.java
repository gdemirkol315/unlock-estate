package com.unlockestate.ueparent.realestate.controller;

import com.unlockestate.ueparent.utils.dto.MessageEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/realEstate")
@RestController
public class RealEstateController {
    @PostMapping("/registerRealEstates")
    public ResponseEntity<MessageEntity> registerRealEstate(){
        return ResponseEntity.ok(new MessageEntity("Real Estate 1,2,3,4"));
    }

    @GetMapping("/getAllRealEstates")
    public ResponseEntity<MessageEntity> allRealEstate(){
        return ResponseEntity.ok(new MessageEntity("Real Estate 1,2,3,4"));
    }

}
