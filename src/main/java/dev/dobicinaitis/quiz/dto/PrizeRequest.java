package dev.dobicinaitis.quiz.dto;

import lombok.Data;

import java.util.List;

@Data
public class PrizeRequest {
    private List<String> answers;
}
