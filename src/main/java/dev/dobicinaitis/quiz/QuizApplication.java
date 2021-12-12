package dev.dobicinaitis.quiz;

import dev.dobicinaitis.quiz.services.QuizService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Slf4j
@SpringBootApplication
public class QuizApplication implements CommandLineRunner {

    @Autowired
    QuizService quizService;

    public static void main(String[] args) {
        SpringApplication.run(QuizApplication.class, args);
    }

    @Override
    public void run(String... strings) throws Exception {
       log.info("Loaded quiz: " + quizService.getQuiz().getQuizItems());
    }
}
