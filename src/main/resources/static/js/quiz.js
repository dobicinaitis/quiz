// global variables
let currentQuestionId;
let currentQuestion;
let answeredQuestions = [];
let isFinalQuestion = false;
let processingFinalQuestion = false;

const typeDelay = 45;
const longTextTypeDelay = 15;
const longTextThreshold = 75; // characters

let messageField = id('message');

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
    // get 1st question
    const firstQuestion = Question.from(await fetch('/api/quiz/begin')
        .then(response => {
            return response.json()
        }));

    currentQuestionId = firstQuestion.id;
    currentQuestion = firstQuestion.text;

    // hide intro
    let intro = id('intro');
    intro.style.transition = '0.8s';
    intro.style.opacity = '0';
    await sleep(800);
    intro.style.display = 'none';

    // reveal quiz elements
    id('quiz').style.opacity = '1';
    await typeMessage(firstQuestion.text);

    let answerContainer = id('answer-container');
    answerContainer.style.visibility = 'visible';
    answerContainer.style.transition = '1s';
    answerContainer.style.opacity = '1';

    // reveal progress bar
    let progress = id('progress-container');
    progress.style.transition = '2s';
    progress.style.opacity = '1';
    updateProgressBar(firstQuestion.progress.text, firstQuestion.progress.decimal);
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

async function typeMessage(message) {
    // fade out old text
    messageField.style.transition = '0.8s';
    messageField.style.opacity = '0';
    await sleep(1000);
    messageField.innerText = " ";
    messageField.style.opacity = '1';

    let delay = typeDelay;

    if (message.length >= longTextThreshold){
        delay = longTextTypeDelay;
    }

    const typewriter = new Typewriter(messageField, {
        loop: false, delay: delay
    });

    typewriter
        .typeString(message)
        .start();

    await sleep(message.length * delay);
}

async function checkAnswer() {
    // prevent repeated submissions for final question
    if (processingFinalQuestion){
        return;
    }

    if (isFinalQuestion){
        processingFinalQuestion = true;
    }

    let answer = id('answer').value;

    if (!answer) {
        await typeMessage("Provide an answer first 😋");
        await sleep(1000);
        await typeMessage(currentQuestion);
        return;
    }

    const request = new CheckAnswerRequest(currentQuestionId, answer);
    const response = CheckAnswerResponse.from(await post('/api/quiz/check-answer', request));

    if (response.status == 'ok') {
        id('answer').value = "";
        id('answer').innerText = "";

        await typeMessage("Yey, that is correct 🥳");
        await sleep(500);
        answeredQuestions.push(currentQuestionId);

        if (!isFinalQuestion) {
            let nextQuestion = await getNextQuestion(response.nextQuestionId);

            if (!isEmpty(nextQuestion)) {
                currentQuestionId = nextQuestion.id;
                currentQuestion = nextQuestion.text;
                isFinalQuestion = nextQuestion.isFinal;
                updateProgressBar(nextQuestion.progress.text, nextQuestion.progress.decimal);
                await typeMessage(currentQuestion);
                return true;
            }
        }
        else {
            const prizeResponse = PrizeResponse.from(await post('/api/quiz/get-prize',
                new PrizeRequest(answeredQuestions)));

            if (!isEmpty(prizeResponse)) {
                await typeMessage(prizeResponse.text);
                id('prize-link').href = prizeResponse.prizeLink;

                // hide answer container
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

                let prizeLink = id('prize-link');
                prizeLink.style.display = 'block';
                prizeLink.style.visibility = 'visible';
                prizeLink.style.transition = '1s';
                prizeLink.style.opacity = '1';

                return;
            }

            processingFinalQuestion = false;
        }
    } else if (response.status == 'nok') {
        await typeMessage("Nope, try again 😋");
        await sleep(1000);
        await typeMessage(currentQuestion);
        return;
    }

    await typeMessage("Something went wrong, please try again 🙁");
    await sleep(1000);
    await typeMessage(currentQuestion);
}

async function getNextQuestion(nextQuestionId) {
    return Question.from(await fetch('/api/quiz/' + nextQuestionId)
        .then(response => {
            return response.json()
        }));
}
