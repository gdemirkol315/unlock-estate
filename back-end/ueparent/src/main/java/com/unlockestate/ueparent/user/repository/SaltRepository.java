package com.unlockestate.ueparent.user.repository;

import com.unlockestate.ueparent.user.dto.Salt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SaltRepository extends JpaRepository<Salt,Integer> {

    @Query(value = "select * from salt where email = ?1", nativeQuery = true)
    Optional<Salt> findByEmail(String email);
}
