package com.unlockestate.ueparent.user.repository;

import com.unlockestate.ueparent.user.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query(value = "select * from users where email = ?1", nativeQuery = true)
    Optional<User> findByEmail(String email);

    @Query(value = "select * from users where role = ?1 and is_active = 'true'", nativeQuery = true)
    Optional<List<User>> findActiveUsersByRole(String role);
}
