package dev.dobicinaitis.quiz;

import dev.dobicinaitis.quiz.config.YamlPropertySourceFactory;
import dev.dobicinaitis.quiz.dto.QuizItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@EnableConfigurationProperties
@EnableAutoConfiguration
@PropertySource(value = "classpath:quiz.yml", factory = YamlPropertySourceFactory.class)
@ConfigurationProperties(prefix = "static")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class QuizLoader {
    private String intro;
    private String outro;
    private String prizeLink;
    private List<QuizItem> quizItems;
}
