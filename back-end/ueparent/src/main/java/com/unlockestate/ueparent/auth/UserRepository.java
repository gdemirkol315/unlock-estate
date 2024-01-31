package com.unlockestate.ueparent.auth;

import com.unlockestate.ueparent.interfaces.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    User findByEmail(String email);
}