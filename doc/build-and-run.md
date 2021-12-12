## Build & Run locally
### Build
#### JAR
```shell
ENV_FILE=.setvar-production
eval "$(grep -Ev "^#" $ENV_FILE | sed '/="/! s/\(=\)\(.*$\)/\1"\2"/g;/^$/d ')"

./gradlew clean build
```
#### Docker image
```shell
ENV_FILE=.setvar-production
eval "$(grep -Ev "^#" $ENV_FILE | sed '/="/! s/\(=\)\(.*$\)/\1"\2"/g;/^$/d ')"

./gradlew clean build
docker build -t quiz:latest .

# docker build -t registry.gitlab.com/dobicinaitis/quiz:latest .
# docker push registry.gitlab.com/dobicinaitis/quiz:latest
```
### Run
#### JAR
```shell
ENV_FILE=.setvar-production
eval "$(grep -Ev "^#" $ENV_FILE | sed '/="/! s/\(=\)\(.*$\)/\1"\2"/g;/^$/d ')"

java -jar build/libs/quiz-*.jar
```
#### Docker image
```shell
docker run --env-file ./.setvar-production-docker -it --rm quiz:latest

# docker run --env-file ./.setvar-production-docker -it --rm registry.gitlab.com/dobicinaitis/quiz:latest
```