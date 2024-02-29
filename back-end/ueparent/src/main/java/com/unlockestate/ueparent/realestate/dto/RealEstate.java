package com.unlockestate.ueparent.realestate.dto;

import com.unlockestate.ueparent.task.dto.CheckList;
import com.unlockestate.ueparent.task.dto.Task;
import jakarta.persistence.*;

import java.util.List;


@Entity
public class RealEstate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String address;
    private String calendarUrl;

    @OneToMany(mappedBy = "realEstate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CheckList> checklists;


    @OneToMany(mappedBy = "realEstate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;

    public RealEstate() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCalendarUrl() {
        return calendarUrl;
    }

    public void setCalendarUrl(String calendarUrl) {
        this.calendarUrl = calendarUrl;
    }

    public List<CheckList> getChecklists() {
        return checklists;
    }

    public void setChecklists(List<CheckList> checklists) {
        this.checklists = checklists;
    }
}