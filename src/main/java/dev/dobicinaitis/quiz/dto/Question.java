package dev.dobicinaitis.quiz.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Question {
    private String id;
    private String text;
    private Boolean isFinal;
    private Progress progress;
}
