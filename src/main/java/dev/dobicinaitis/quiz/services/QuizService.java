package dev.dobicinaitis.quiz.services;

import dev.dobicinaitis.quiz.QuizLoader;
import dev.dobicinaitis.quiz.dto.*;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static dev.dobicinaitis.quiz.converters.QuizItemToQuestionDTO.convert;
import static dev.dobicinaitis.quiz.converters.QuizItemToQuestionDTO.getQuestionId;
import static dev.dobicinaitis.quiz.dto.AnswerCheckStatus.CORRECT;
import static dev.dobicinaitis.quiz.dto.AnswerCheckStatus.WRONG;

@Service
@Getter
public class QuizService {
    @Autowired
    QuizLoader quiz;

    public CheckAnswerResponse checkAnswer(CheckAnswerRequest answer) {
        CheckAnswerResponse response = CheckAnswerResponse.builder().status(WRONG).build();
        QuizItem quizItem = getQuizItemByQuestionId(answer.getId());

        if (quizItem == null) {
            return response;
        }

        Boolean isAnswerCorrect = quizItem.getAnswers().stream()
                .anyMatch(a -> a.trim().equalsIgnoreCase(answer.getAnswer()));

        if (isAnswerCorrect) {
            response.setStatus(CORRECT);
            if (quizItem.getId() < getQuestionCount()) {
                response.setNextQuestionId(getQuestionId(quiz.getQuizItems().get(quizItem.getId())));
            }
        }

        return response;
    }

    public Question getQuestionByQuizItemId(int number) {
        QuizItem quizItem = quiz.getQuizItems().stream()
                .filter(s -> s.getId().equals(number))
                .findFirst()
                .orElse(null);

        if (quizItem == null) {
            return null;
        }

        return convert(quizItem, getQuestionCount());
    }

    public QuizItem getQuizItemByQuestionId(String id) {
        return quiz.getQuizItems().stream()
                .filter(item -> getQuestionId(item).equals(id))
                .findFirst()
                .orElse(null);
    }

    public Question getQuestionById(String id) {
        QuizItem quizItem = quiz.getQuizItems().stream()
                .filter(item -> getQuestionId(item).equals(id))
                .findFirst()
                .orElse(null);

        if (quizItem == null) {
            return null;
        }

        return convert(quizItem, getQuestionCount());
    }

    public PrizeResponse getPrize(PrizeRequest answerIds) {
        long correctAnswers = quiz.getQuizItems().stream()
                .filter(quizItem -> answerIds.getAnswers().contains(getQuestionId(quizItem)))
                .count();

        if (correctAnswers == getQuestionCount()) {
            return PrizeResponse.builder()
                    .text(quiz.getOutro())
                    .prizeLink(quiz.getPrizeLink())
                    .build();
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough correct answers were provided, try again");
    }

    public int getQuestionCount() {
        return quiz.getQuizItems().size();
    }
}
