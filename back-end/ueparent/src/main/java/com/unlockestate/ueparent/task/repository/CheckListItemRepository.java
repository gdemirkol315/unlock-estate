package com.unlockestate.ueparent.task.repository;


import com.unlockestate.ueparent.task.dto.CheckListItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CheckListItemRepository extends JpaRepository<CheckListItem, Integer> {
    Optional<List<CheckListItem>> findByCheckListIdIn(Collection<Integer> checkListIds);
}
