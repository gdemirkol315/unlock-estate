package com.unlockestate.ueparent.task.dto;

import com.unlockestate.ueparent.realestate.dto.RealEstate;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class CheckList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "real_estate_id", foreignKey = @ForeignKey(name = "FK_REAL_ESTATE"))
    private RealEstate realEstate;

    @OneToMany(fetch = FetchType.EAGER,mappedBy = "checkList", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CheckListItem> checkListItems;

    public CheckList() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public RealEstate getRealEstate() {
        return realEstate;
    }

    public void setRealEstate(RealEstate realEstate) {
        this.realEstate = realEstate;
    }

    public List<CheckListItem> getCheckListItems() {
        return checkListItems;
    }

    public void setCheckListItems(List<CheckListItem> checkListItems) {
        this.checkListItems = checkListItems;
    }
}