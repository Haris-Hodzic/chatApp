package com.Evolt.chatApp.controller;

import com.Evolt.chatApp.model.User;
import com.Evolt.chatApp.service.ActiveUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ConnectionController {

    @Autowired
    private ActiveUserService activeUserService;

    @PostMapping("/user/connect")
    public String createUser() {
        return activeUserService.createNewUser();
    }

    @GetMapping("/user/active")
    public List<User> getActiveUsersExceptCurrentUser(@RequestParam String userName) {
        return activeUserService.getActiveUsersExceptCurrentUser(userName);
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic")
    public User addUser(@Payload User user,
                           SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", user.getName());
        activeUserService.addNewUser(user.getName());
        return user;
    }
}
