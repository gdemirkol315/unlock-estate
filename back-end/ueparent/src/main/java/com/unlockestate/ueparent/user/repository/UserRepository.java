package com.unlockestate.ueparent.user.repository;

import com.unlockestate.ueparent.realestate.dto.RealEstate;
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

    @Query(value = "select u.* from users u, task t where u.user_id = t.assignee_user_id and t.id = ?1", nativeQuery = true)
    Optional<User> findAssigneeByTaskId(Integer taskId);

    @Query(value = "select u.* from users u, task t where u.user_id = t.creator_user_id and t.id = ?1", nativeQuery = true)
    Optional<User> findCreatorByTaskId(Integer taskId);
}
