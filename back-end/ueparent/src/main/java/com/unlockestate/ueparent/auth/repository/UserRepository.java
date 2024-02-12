package com.unlockestate.ueparent.auth.repository;

import com.unlockestate.ueparent.auth.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query(value = "select * from users where email = ?1", nativeQuery = true)
    Optional<User> findByEmail(String email);
}
