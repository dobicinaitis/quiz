package dev.dobicinaitis.quiz.dto;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AnswerCheckStatus {
    CORRECT("ok"), WRONG("nok");

    @JsonValue
    private String status;
}
