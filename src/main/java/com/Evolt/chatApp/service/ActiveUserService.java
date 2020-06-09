package com.Evolt.chatApp.service;

import com.Evolt.chatApp.model.User;
import com.Evolt.chatApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ActiveUserService {

    @Autowired
    private UserRepository repository;

    public String createNewUser() {
        User lastUser = repository.findTopByOrderByIdDesc();
        if (lastUser != null) {
            Long lastId = lastUser.getId();
            return "User_" + (lastId + 1);
        } else {
            return "User_1";
        }
    }

    public void addNewUser(String username) {
        User newUser = new User();
        newUser.setName(username);
        repository.save(newUser);
    }

    @Transactional
    public Long remove(String username) {
        return repository.deleteByName(username);
    }

    public List<User> getActiveUsersExceptCurrentUser(String username) {
        List<User> users = repository.findAll();
        users.remove(repository.findByName(username));
        return users;
    }
}
