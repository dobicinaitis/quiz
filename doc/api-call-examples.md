### API requests

Test requests via Swagger UI [/api](http://localhost:8080/api) or using `curl`.

#### Get first question

```shell
curl http://localhost:8080/api/quiz/begin
```

```json
{
  "id": "2a1a2dfb-181d-3480-a831-942f30bb2cb5",
  "text": "How many ghosts show up in A Christmas Carol?",
  "isFinal": false,
  "progress": {
    "text": "1/10",
    "decimal": 0.1
  }
}
```

#### Check answer

**OK**

```shell
curl -X POST http://localhost:8080/api/quiz/check \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "2a1a2dfb-181d-3480-a831-942f30bb2cb5",
  "answer": "4"
}'
```

```json
{
  "status": "ok",
  "nextQuestionId": "e1ba2a29-3915-3320-bae9-eebe91d6271e"
}
```

**NOK**

```shell
curl -X POST http://localhost:8080/api/quiz/check-answer \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "2a1a2dfb-181d-3480-a831-942f30bb2cb5",
  "answer": "100"
}'
```

```json
{
  "status": "nok",
  "nextQuestionId": null
}
```

#### Get next question

```shell
curl http://localhost:8080/api/quiz/e1ba2a29-3915-3320-bae9-eebe91d6271e
```

```json
{
  "id": "e1ba2a29-3915-3320-bae9-eebe91d6271e",
  "text": "Is Die Hard a Christmas movie?",
  "isFinal": false,
  "progress": {
    "text": "2/10",
    "decimal": 0.2
  }
}
```

#### Get prize link

List of all answered question IDs needs to be provided to get the prize link.

**OK**

```shell
curl -X POST http://localhost:8080/api/quiz/get-prize
  -H 'Content-Type: application/json' \
  -d '{
  "answers": [
    "2a1a2dfb-181d-3480-a831-942f30bb2cb5",
    "e1ba2a29-3915-3320-bae9-eebe91d6271e",
    "..."
  ]
}'
```

```json
{
  "text": "Congrats, you answered all questions right! Claim your prize below 🎉",
  "prizeLink": "https://www.youtube.com/watch?v=ItGkqRcJFRQ"
}
```

**NOK**

```shell
curl -X POST http://localhost:8080/api/quiz/get-prize
  -H 'Content-Type: application/json' \
  -d '{
  "answers": [
    "2a1a2dfb-181d-3480-a831-942f30bb2cb5",
    "e1ba2a29-3915-3320-bae9-eebe91d6271e"
  ]
}'
```

```json
{
  "timestamp": "...",
  "status": 400,
  "error": "Bad Request",
  "trace": "...",
  "message": "Not enough correct answers were provided, try again",
  "path": "/api/quiz/get-prize"
}
```