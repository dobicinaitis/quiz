FROM openjdk:11-jre
RUN mkdir -p /app;
COPY run.sh /app/
COPY build/libs/quiz-*.jar /app/app.jar
ENTRYPOINT /app/run.sh
