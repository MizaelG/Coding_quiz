const QUIZ_SECTIONS = document.querySelectorAll(".quiz-section");

const start_Section = document.getElementById("start");
const start_Btn = document.getElementById("start-button");

const QUIZ_SECTION = document.getElementById("quiz-questions");
const time_remaining = document.getElementById("time-remaining");
const question = document.getElementById("question");
const choices = document.getElementById("choices");
const choices_Status = document.querySelectorAll(".choice-status");
const correct = document.getElementById("correct");
const wrong = document.getElementById("wrong");

const end_section = document.getElementById("end");
const end_title = document.getElementById("end-title");
const score = document.getElementById("score");
const initials_input = document.getElementById("initals");
const submit_score = document.getElementById("submit-score");
const error_message = document.getElementById("error-message");

class Question {
    constructor(question, choices, indexOfCorrectChoice) {
        this.question = question;
        this.choices = choices;
        this.indexOfCorrectChoice = indexOfCorrectChoice;
    }
}

const question_1 = new Question('HTML stands for ____ ?',
["HighText Machine Language",
"HyperText and links Markup Language",
"HyperText Markup Language",
"None of these",], 3);

const question_2 = new Question("Which of the following element is the responsible for making the text bold in HTML",
['<pre>', '<a>', '<b>', '<br>'], 3);

const question_3 = new Question('Which of the following tag is used for inserting the largest heading in HTML?',
['<h3>', '<h1>', '<h5>', '<h6>'], 2);

const question_4 = new Question('How can you catch a computer virus?',
['Sending e-mail messages',
'Using a laptop during the winter',
'Opening e-mail attachments',
'Shopping on-line',], 3);

const question_5 = new Question('Google (www.google.com) is a:',
['Search Engine',
'Number in Math',
'Directory of images',
'Chat service on the web',], 1);

const question_6 = new Question('Which of the following is not a valid domain name?',
['wwww.yahoo.com',
'www.yahoo.net',
'www.com.yahoo',
'www.yahoo.co.in',], 3);

const question_list = [question_1, question_2, question_3, question_4, question_5, question_6];

let currentQuestion = 0;

let totalTime = 60;
let totalTimeInterval;
let choiceStatusTimeout;

start_Btn.addEventListener('click', startGame);
choices.addEventListener('click', processChoice);
submit_score.addEventListener('submit', processInput);

function startGame(){
    showElement(QUIZ_SECTIONS, QUIZ_SECTION);

    displayTime();
    displayQuestion();

    startTimer();
}

function showElement(siblingList, showElement) {
    for (element of siblingList) {
        hideElement(element);
    }
    showElement.classList.remove('hidden');   
}

function hideElement(element) {
    if(!element.classList.contains("hidden")){
        element.classList.add('hidden');
    }
}

function displayTime() {
    time_remaining.textContent = totalTime;
}


function startTimer(){
    totalTimeInterval = setInterval(function(){
        totalTime--;
        displayTime();
        checkTime();

    }, 1000);
}

function checkTime(){
    if(totalTime <= 0) {
        totalTime = 0;
        endGame();
    }
}

// Questions functions
function displayQuestion(){
    question.textContent = question_list[currentQuestion].question;

    displayChoiceList();
}

function displayChoiceList(){
    choices.innerHTML = "";

    question_list[currentQuestion].choices.forEach(function(answer, index) {
        const li = document.createElement("li");
        li.dataset.index = index;
        
        const button = document.createElement("button");
        button.textContent = (index + 1) + '.' + answer;
        li.appendChild(button);
        choices.appendChild(li);
    });
}

// Answering a Question
function processChoice(event){
    const userChoice = parseInt(event.target.parentElement.dataset.index);

    resetChoiceStatusEffect();
    checkChoice(userChoice);
    getNextQuestion();
}

function resetChoiceStatusEffect() {
    clearTimeout(choiceStatusTimeout);
    styleTimeReaminingDefault();
}

function styleTimeReaminingDefault(){
    time_remaining.style.color = '#4616E8';
}

function styleTimeReaminingWrong(){
    time_remaining.style.color = '#E81648';
}

function checkChoice(userChoice){
    if(isChoiceCorrect(userChoice)){
        displayCorrectChoiceEffects();
    } else {
        displayWrongChoiceEffects();
    }
}

function isChoiceCorrect(choice) {
    return choice === question_list[currentQuestion].indexOfCorrectChoice;
}

function displayWrongChoiceEffects(){
    deductTimeBy(5);

    styleTimeReaminingWrong();
    showElement(choices_Status, wrong);

    choiceStatusTimeout = setTimeout(function(){
        hideElement(wrong);
        styleTimeReaminingDefault();
    }, 1000);
}

function deductTimeBy(seconds){
    totalTime -= seconds;
    checkTime();
    displayTime();
}

function displayCorrectChoiceEffects(){
    showElement(choices_Status, correct);

    choiceStatusTimeout = setTimeout(function(){
        hideElement(correct);
    }, 1000);
}


function getNextQuestion(){
    currentQuestion++;
    if(currentQuestion >= question_list.length) {
        endGame();
    } else {
        displayQuestion();
    }
}

function endGame(){
    clearInterval(totalTimeInterval);

    showElement(QUIZ_SECTIONS, end_section);
    displayScore();
    setEndHeading();
}

function displayScore() {
    score.textContent = totalTime;
}


function setEndHeading(){
    if(totalTime === 0){
        end_title.textContent = 'Sorry! Time out!';
    } else {
        end_title.textContent = 'Congrats! Your done!';
    }
}
// Submit Initials
function processInput(event){
    event.preventDefault();

    const initials = initials_input.ariaValueMax.toUpperCase();

    if(isInputValid(initials)){
        const score = totalTime;
        const highscoreEntry = getNewHighscoreEntry(initials, score);
        saveHighscoreEntry(highscoreEntry);
        window.location.href= './highscores/html';
    }
}

function getNewHighscoreEntry(initials, score){
    const entry = {
        initials: initials,
        score: score,
    }
    return entry;
}


function isInputValid(initials){
    let errorMessage = '';
    if(initials === ''){
        errorMessage = 'Your cant submit empty initials!';
        displayFormError(errorMessage);
        return false;
    } else if(initials.match(/[^a-z]/ig)) {
        errorMessage = 'Intitals may only include letters.'
        displayFormError(errorMessage);
        return false;
    } else {
        return true;
    }
}

function displayFormError(errorMessage){
    error_message.textContent = errorMessage;
    if(!initials_input.classList.contains('error')){
        initials_input.classList,add('error');
    }
}

function saveHighscoreEntry(highscoreEntry){
    const currentScores = getScoreList();
    placeEntryInHighscoreList(highscoreEntry, currentScores);
    localStorage.setItem('scoreList', JSON.stringify(currentScores));
}

function getScoreList(){
    const currentScores = localStorage.getItem('scoreList');
    if(currentScores){
        return JSON.parse(currentScores);
    } else {
        return [];
    }
}

function placeEntryInHighscoreList(newEntry, scoreList){
    const newScoreIndex = getNewScoreIndex(newEntry, scoreList);
    scoreList.splice(newScoreIndex, 0, newEntry);
}

function getNewScoreIndex(newEntry, scoreList){
    if(scoreList.length > 0){
        for(let i = 0; i < scoreList.length; i++){
            if(scoreList[i].score <= newEntry.score){
                return i;
            }
        }
    }
    return scoreList.length
}