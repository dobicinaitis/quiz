package dev.dobicinaitis.quiz.controllers;

import dev.dobicinaitis.quiz.dto.*;
import dev.dobicinaitis.quiz.services.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
public class QuizControllers {

    @Autowired
    QuizService quizService;

    @GetMapping("/api/quiz/begin")
    @Operation(summary = "Get first question")
    public Question getFirstQuestion() {
        log.info("GET /api/quiz/begin was called");
        Question response = quizService.getQuestionByQuizItemId(1);
        log.info("Sending response: {}", response);
        return response;
    }

    @GetMapping("/api/quiz/{questionId}")
    @Operation(summary = "Get question by ID")
    public Question getFirstQuestion(@PathVariable String questionId) {
        log.info("GET /api/quiz/{} was called", questionId);
        Question response = quizService.getQuestionById(questionId);
        log.info("Sending response: {}", response);
        return response;
    }

    @PostMapping("/api/quiz/check-answer")
    @Operation(summary = "Check answer and get next question ID")
    public CheckAnswerResponse checkAnswer(@RequestBody CheckAnswerRequest answer) {
        log.info("POST /api/quiz/check-answer was called, answer = {}", answer);
        CheckAnswerResponse response = quizService.checkAnswer(answer);
        log.info("Sending response: {}", response);
        return response;
    }

    @PostMapping("/api/quiz/get-prize")
    @Operation(summary = "Get prize by providing IDs of all answered questions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful retrieval of prize link"),
            @ApiResponse(responseCode = "400", description = "Not enough correct answers were provided, try again")
    }
    )
    public PrizeResponse getFirstQuestion(@RequestBody PrizeRequest answerIds) {
        log.info("GET /api/quiz/get-prize was called, answerIds = {}", answerIds);
        PrizeResponse response = quizService.getPrize(answerIds);
        log.info("Sending response: {}", response);
        return response;
    }
}
