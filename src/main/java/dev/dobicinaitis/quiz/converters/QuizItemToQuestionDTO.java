package dev.dobicinaitis.quiz.converters;

import dev.dobicinaitis.quiz.dto.Progress;
import dev.dobicinaitis.quiz.dto.Question;
import dev.dobicinaitis.quiz.dto.QuizItem;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Slf4j
public class QuizItemToQuestionDTO {
    public static Question convert(QuizItem item, int totalCount) {
        return Question.builder()
                .id(getQuestionId(item))
                .text(item.getQuestion())
                .isFinal((item.getId() == totalCount))
                .progress(Progress.builder()
                        .text(item.getId() + "/" + totalCount)
                        .decimal(getPercentageDecimal(item.getId(), totalCount))
                        .build())
                .build();
    }

    public static String getQuestionId(QuizItem quizItem) {
        return UUID.nameUUIDFromBytes(quizItem.toString().getBytes(StandardCharsets.UTF_8)).toString();
    }

    private static float getPercentageDecimal(int number, int total) {
        return (float) number / total;
    }
}
