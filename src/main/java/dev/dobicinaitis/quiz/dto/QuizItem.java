package dev.dobicinaitis.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.boot.context.properties.ConstructorBinding;

import java.util.List;

@ConstructorBinding
@AllArgsConstructor
@Data
public class QuizItem {
    private Integer id;
    private String question;
    private List<String> answers;
}
