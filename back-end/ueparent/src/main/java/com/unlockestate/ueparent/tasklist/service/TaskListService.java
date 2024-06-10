package com.unlockestate.ueparent.tasklist.service;

import com.unlockestate.ueparent.realestate.dto.RealEstate;
import com.unlockestate.ueparent.realestate.service.RealEstateService;
import com.unlockestate.ueparent.utils.functions.Functions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TaskListService {

    RealEstateService realEstateService;

    @Autowired
    public TaskListService(RealEstateService realEstateService) {
        this.realEstateService = realEstateService;
    }

    public List<RealEstate> getRealEstateWithCheckOut(Date date) {

        List<RealEstate> realEstates = realEstateService.getAllActiveRealEstates();
        List<RealEstate> realEstatesToCheckOut = new ArrayList<>();

        for (RealEstate realEstate : realEstates) {
            List<Date> checkouts = realEstateService.getCheckOutDates(realEstate.getCalendarUrl());
            for (Date checkout: checkouts){
                if (Functions.isDateSameDay(checkout,date)){
                    realEstatesToCheckOut.add(realEstate);
                }
            }
        }

        return realEstatesToCheckOut;

    }

}
