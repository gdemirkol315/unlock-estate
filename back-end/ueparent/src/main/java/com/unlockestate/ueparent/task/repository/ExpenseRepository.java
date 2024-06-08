package com.unlockestate.ueparent.task.repository;


import com.unlockestate.ueparent.task.dto.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {

}
