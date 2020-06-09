package com.Evolt.chatApp.repository;

import com.Evolt.chatApp.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByFromUserInAndToUserIn(List<String> fromUser, List<String> toUser);
    List<Message> findAllByToUser(String toUser);
}
