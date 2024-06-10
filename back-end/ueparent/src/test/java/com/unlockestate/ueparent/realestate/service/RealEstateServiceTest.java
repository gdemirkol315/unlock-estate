package com.unlockestate.ueparent.realestate.service;

import com.unlockestate.ueparent.realestate.repository.RealEstateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Date;
import java.util.List;


public class RealEstateServiceTest {

    @Mock
    private RealEstateRepository realEstateRepository;

    @InjectMocks
    private RealEstateService realEstateService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void parseCalendar() {
        List<Date> checkOutDates = realEstateService.getCheckOutDates("https://www.airbnb.fr/calendar/ical/1035604842765485067.ics?s=fbb265a6900227d24f3960204d892145");
        for (Date date: checkOutDates){
            System.out.println(date);
        }
    }
}
