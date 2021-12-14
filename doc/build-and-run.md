## Build & Run locally
### Build
#### JAR
```shell
./gradlew clean build
```
#### Docker image
```shell
./gradlew clean build
docker build -t quiz:latest .

# docker build -t registry.gitlab.com/dobicinaitis/quiz:latest .
# docker push registry.gitlab.com/dobicinaitis/quiz:latest
```
### Run
#### JAR
```shell
java -jar build/libs/quiz-*.jar
```
#### Docker image
```shell
docker run -it --rm quiz:latest

# docker run -it --rm registry.gitlab.com/dobicinaitis/quiz:latest
```
