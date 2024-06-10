package com.unlockestate.ueparent.utils.functions;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.ParserException;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.util.MapTimeZoneCache;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class Functions {
    public static Calendar parseCalendarFromLink(String icsUrl) {
        Calendar calendar = new Calendar();
        try {
            // Set the timezone cache (optional)
            System.setProperty("net.fortuna.ical4j.timezone.cache.impl", MapTimeZoneCache.class.getName());

            // Open a connection to the URL
            URL url = new URL(icsUrl);
            InputStream inputStream = url.openStream();

            // Create a CalendarBuilder
            CalendarBuilder builder = new CalendarBuilder();

            // Build the calendar from the input stream
            calendar = builder.build(inputStream);
        } catch (ParserException e) {
            throw new RuntimeException(e);
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return calendar;
    }

    public static boolean isDateSameDay(Date date1, Date date2){
        // Convert Date to LocalDate
        LocalDate localDate1 = date1.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate localDate2 = date2.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        // Compare LocalDate objects
        return localDate1.isEqual(localDate2);
    }
}