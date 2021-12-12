// global variables
let currentQuestionId;
let currentQuestion;
let answeredQuestions = [];
let isFinalQuestion = false;

const typeSpeed = 40;
const typewriter = new Typewriter(id('message'), {
    loop: false, delay: typeSpeed
});

// define classes
class Question {
    constructor(id, text, isFinal, progress) {
        this.id = id;
        this.text = text;
        this.isFinal = isFinal;
        this.progress = Progress.from(progress);
    }

    static from(json) {
        return Object.assign(new Question(), json);
    }
}

class Progress {
    constructor(text, decimal) {
        this.text = text;
        this.decimal = decimal;
    }

    static from(json) {
        return Object.assign(new Progress(), json);
    }
}

class CheckAnswerRequest {
    constructor(id, answer) {
        this.id = id;
        this.answer = answer;
    }
}

class CheckAnswerResponse {
    constructor(status, nextQuestionId) {
        this.status = status;
        this.nextQuestionId = nextQuestionId;
    }

    static from(json) {
        return Object.assign(new CheckAnswerResponse(), json);
    }
}

class PrizeRequest {
    constructor(answers) {
        this.answers = answers;
    }
}

class PrizeResponse {
    constructor(text, prizeLink) {
        this.text = text;
        this.prizeLink = prizeLink;
    }

    static from(json) {
        return Object.assign(new PrizeResponse(), json);
    }
}

// do stuff
async function startQuiz() {
    let intro = id('intro');
    intro.style.transition = '0.8s';
    intro.style.opacity = '0';
    intro.style.display = 'none';
    await sleep(800);

    // get 1st question
    const firstQuestion = Question.from(await fetch('/api/quiz/begin')
        .then(response => {
            return response.json()
        }));

    currentQuestionId = firstQuestion.id;
    currentQuestion = firstQuestion.text;

    // reveal quiz elements
    id('quiz').style.opacity = '1';

    typeMessage(firstQuestion.text);
    await sleep(firstQuestion.text.length * typeSpeed - 500);

    // reveal progress bar
    let progress = id('progress-container');
    progress.style.transition = '1s';
    progress.style.opacity = '1';
    updateProgressBar(firstQuestion.progress.text, firstQuestion.progress.decimal);

    await sleep(1000);
    let answerContainer = id('answer-container');
    answerContainer.style.visibility = 'visible';
    answerContainer.style.transition = '1s';
    answerContainer.style.opacity = '1';
}

// init progress bar
const bar = new ProgressBar.Circle('#progress-bar', {
    strokeWidth: 18,
    easing: 'easeInOut',
    duration: 1500,
    color: getComputedStyle(document.body).getPropertyValue("--accent"),
    trailColor: getComputedStyle(document.body).getPropertyValue("--accent-light"),
    trailWidth: 2,
    svgStyle: null
});

function updateProgressBar(text, progress) {
    bar.animate(progress);  // number from 0.0 to 1.0
    id('progress-text').innerText = text;
}

function typeMessage(message) {
    typewriter
        .deleteAll()
        .typeString(message)
        .pauseFor(1000)
        .start();
}

async function checkAnswer() {
    let answer = id('answer').value;

    if (!answer) {
        typeMessage("Provide an answer first 😋");
        typeMessage(currentQuestion);
        return;
    }

    const request = new CheckAnswerRequest(currentQuestionId, answer);
    const response = CheckAnswerResponse.from(await post('/api/quiz/check-answer', request));

    let nextQuestion;
    if (response.status == 'ok') {
        typeMessage("Yey, that is correct 🥳");
        answeredQuestions.push(currentQuestionId);

        if (!isFinalQuestion) {
            nextQuestion = await getNextQuestion(response.nextQuestionId);

            if (!isEmpty(nextQuestion)) {
                id('answer').value = "";
                currentQuestionId = nextQuestion.id;
                currentQuestion = nextQuestion.text;
                isFinalQuestion = nextQuestion.isFinal;
                typeMessage(currentQuestion);
                await sleep(5000);
                updateProgressBar(nextQuestion.progress.text, nextQuestion.progress.decimal);
                return true;
            }
        }
        else {
            const prizeResponse = PrizeResponse.from(await post('/api/quiz/get-prize',
                new PrizeRequest(answeredQuestions)));

            if (!isEmpty(prizeResponse)) {
                typeMessage(prizeResponse.text);
                id('prize-link').href = prizeResponse.prizeLink;

                // hide answer container
                await sleep(1000);
                let answerContainer = id('answer-container');
                answerContainer.style.transition = '1s';
                answerContainer.style.opacity = '0';
                await sleep(1000);
                answerContainer.style.display = 'none';

                // reveal prize elements
                let prize = id('prize');
                prize.style.display = 'initial';
                prize.style.visibility = 'visible';
                prize.style.opacity = '1';

                await sleep(6000);
                let prizeLink = id('prize-link');
                prizeLink.style.display = 'block';
                prizeLink.style.visibility = 'visible';
                prizeLink.style.transition = '1s';
                prizeLink.style.opacity = '1';

                return;
            }
        }
    } else if (response.status == 'nok') {
        typeMessage("Nope, try again");
        typeMessage(currentQuestion);
        return;
    }

    typeMessage("Something went wrong, please try again 🙁");
    typeMessage(currentQuestion);
}

async function getNextQuestion(nextQuestionId) {
    return Question.from(await fetch('/api/quiz/' + nextQuestionId)
        .then(response => {
            return response.json()
        }));
}