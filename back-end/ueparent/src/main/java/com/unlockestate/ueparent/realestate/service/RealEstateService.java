package com.unlockestate.ueparent.realestate.service;

import com.unlockestate.ueparent.realestate.dto.RealEstate;
import com.unlockestate.ueparent.realestate.repository.RealEstateRepository;
import com.unlockestate.ueparent.utils.functions.Functions;
import net.fortuna.ical4j.model.component.VEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Service
public class RealEstateService {


    private final RealEstateRepository realEstateRepository;

    @Autowired
    public RealEstateService(RealEstateRepository realEstateRepository) {
        this.realEstateRepository = realEstateRepository;
    }

    public RealEstate saveRealEstate(RealEstate realEstate) {
        return this.realEstateRepository.save(realEstate);
    }

    public RealEstate updateRealEstate(RealEstate realEstate) {


        return realEstateRepository.save(realEstate);
    }


    public List<RealEstate> getAllRealEstates() {
        return realEstateRepository.findAll();
    }

    public List<RealEstate> getAllActiveRealEstates() {
        return realEstateRepository.findAllActiveRealEstates().orElseThrow();
    }
    public RealEstate getRealEstate(String reId) {
        return realEstateRepository.findById(Integer.parseInt(reId)).orElseThrow();
    }

    public RealEstate getRealEstateFromTask(String taskId){
        return realEstateRepository.findByTaskId(Integer.parseInt(taskId)).orElseThrow();
    }

    public List<Date> getCheckOutDates(String calendarUrl) {

        net.fortuna.ical4j.model.Calendar calendar = Functions.parseCalendarFromLink(calendarUrl);
        List<Date> checkOuts = new LinkedList<>();

        for (Object component : calendar.getComponents()) {
            if (component instanceof VEvent) {
                VEvent event = (VEvent) component;
                checkOuts.add(event.getEndDate().getDate());
            }
        }
        return checkOuts;
    }

}
