package dev.dobicinaitis.quiz.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PrizeResponse {
    private String text;
    private String prizeLink;
}
