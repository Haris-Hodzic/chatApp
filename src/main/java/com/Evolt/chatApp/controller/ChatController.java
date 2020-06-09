package com.Evolt.chatApp.controller;

import com.Evolt.chatApp.model.Message;
import com.Evolt.chatApp.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping(value = "/api")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/send/message")
    public Message useSocketCommunication(Message message){
        return chatService.sendMessage(message);
    }
    @GetMapping("/user/messages")
    public List<Message> getUserMessages(@RequestParam String fromUser, @RequestParam String toUser) {
        return chatService.getUserMessages(fromUser, toUser);
    }
}
