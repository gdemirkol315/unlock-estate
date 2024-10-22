package com.unlockestate.ueparent.task.repository;


import com.unlockestate.ueparent.task.dto.CheckList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CheckListRepository extends JpaRepository<CheckList, Integer> {
    Optional<List<CheckList>> findByRealEstateId(Integer realEstateId);
}
