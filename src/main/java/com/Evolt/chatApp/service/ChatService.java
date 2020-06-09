package com.Evolt.chatApp.service;

import com.Evolt.chatApp.model.Message;
import com.Evolt.chatApp.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;


@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public Message sendMessage(Message message) {
            LocalDateTime time = LocalDateTime.now();
            DateTimeFormatter  timeFormat= DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm:ss");
            message.setTime(time.format(timeFormat));
            if (message.getMessage() != "" && message.getMessage() != null) {
                messageRepository.save(message);
            }
            if(!message.getToUser().equals("Global")){
                this.simpMessagingTemplate.convertAndSend("/topic/" + message.getToUser(), message);
                this.simpMessagingTemplate.convertAndSend("/topic/" + message.getFromUser(), message);
            }else{
                this.simpMessagingTemplate.convertAndSend("/topic", message);
            }
        return message;
    }
    public List<Message> getUserMessages(String fromUser, String toUser) {
        if (toUser.equals("Global")) {
            return messageRepository.findAllByToUser(toUser);
        } else {
            List<String> list = new ArrayList<>();
            list.add(fromUser);
            list.add(toUser);
            return messageRepository.findAllByFromUserInAndToUserIn(list, list);
        }
    }
}
