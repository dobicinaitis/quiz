package dev.dobicinaitis.quiz.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Progress {
    private String text;
    private float decimal;
}
