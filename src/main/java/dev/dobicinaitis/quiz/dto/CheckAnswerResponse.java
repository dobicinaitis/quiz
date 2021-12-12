package dev.dobicinaitis.quiz.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckAnswerResponse {

    private AnswerCheckStatus status;
    private String nextQuestionId;
}
