package dev.dobicinaitis.quiz.dto;

import lombok.Data;

@Data
public class CheckAnswerRequest {
    private String id;
    private String answer;
}
