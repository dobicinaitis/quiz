package dev.dobicinaitis.quiz.controllers;

import dev.dobicinaitis.quiz.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexControllers {

    @Autowired
    QuizService quizService;

    @GetMapping(value = {"/", "/index"})
    public String index(Model model) {

        model.addAttribute("title", quizService.getQuiz().getTitle());
        model.addAttribute("intro", quizService.getQuiz().getIntro());

        return "index";
    }
}
