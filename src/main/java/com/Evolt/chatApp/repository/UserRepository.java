package com.Evolt.chatApp.repository;

import com.Evolt.chatApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Long deleteByName(String name);
    User findTopByOrderByIdDesc();
    User findByName(String name);
}
