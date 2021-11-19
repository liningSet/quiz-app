//variable declarations

const nextBtn = document.querySelector("#next-btn");
const startBtn = document.querySelector("#start-btn");
const againBtn = document.querySelector("#again-btn");
const timeDiv = document.querySelector(".time");
const questions = document.querySelectorAll(".question");
const answers = document.querySelectorAll(".answer");
const questionIndicator = document.querySelector(".question-indicator");
const progressBar = document.querySelector(".progress");
const resultsTab = document.querySelector(".results");
const startTab = document.querySelector(".start-section");
const boardFooter = document.querySelector(".board-footer");
const corrAns = document.querySelector(".correctanswers");
const incorrAns = document.querySelector(".incorrectanswers");
const emptyAns = document.querySelector(".emptyanswers");
let interval;
let questionsPassed = 1;
let results = {
    answeredCorrect: 0,
    answeredIncorrect: 0,
    empty: 0,
}

/*
this function loads the next question in row as well as taking care of the previous
the duration parameter is the amount of seconds that in each question will be counted down from
*/
function goToNext(duration){
    questionsPassed++;

    //resets the timer every time the next question is loaded
    clearInterval(interval);
    interval = setInterval(Interval , 1000);

    //checks if the user has gone to the next que without answering the current
    let check = [...document.querySelectorAll(`#q${questionsPassed - 1} .answer`)].some(answer => {
        return answer.classList.contains("selected");
    });

    if((!check) && timeDiv.innerText !== "0") results.empty++;

    //this part is run until the user reaches to the last question
    if ((questionsPassed) <= questions.length){
        document.querySelector(`#q${questionsPassed}`).style.display = "flex";
        document.querySelector(`#q${questionsPassed - 1}`).style.display = "none";
        timeDiv.innerText = duration;
        questionIndicator.innerHTML = `<b>${questionsPassed}</b> of ${questions.length} Questions`;
        progressBar.style.width = `${questionsPassed * (100 / questions.length)}%`;
    } else{
        //this part runs after the user is finished answering all the questions
        setResultBoard();
        resultsTab.style.display = "flex";
        clearInterval(interval);
        timeDiv.innerText = "0";

        //if the user wins there's a confetti rain going on for him :)
        if(results.answeredCorrect > (results.answeredIncorrect || results.empty)){
            confetti.start();
            setTimeout(() => {
                confetti.stop();
            }, 7500);
        }
    }
    
    //extra styles applied in the results tab
    if((questionsPassed) > questions.length){
        nextBtn.style.display = "none";
        againBtn.style.display = "block";
        againBtn.style.marginLeft = "auto";
        questionIndicator.style.display = "none";
        questions.forEach(q => q.style.display = "none");
    }
}

/*
detects if the element parameter is equal to the true answer, if so
 it applies a green tone to the answer chosen if not it gives a red tone
 to the user's answer 
 as well as showing the true one 

 note: it also updates the result object's values accordingly
*/
function showTrueandFalse(element){
    let trueAnswer = document.querySelector(`#q${questionsPassed} .true`);
    if(element.classList.contains("true")){
        element.classList.add("correct");
        if(element.classList.contains("selected")) results.answeredCorrect++;
    } else{
        element.classList.add("incorrect");
        trueAnswer.classList.add("correct");
        if(element.classList.contains("selected")) results.answeredIncorrect++;
    }

    untouchable(element);
}


/*
if the user fails to choose an answer during the specified time this function is run
causing the true answer to reveal and make user lose this round of question
*/
function revealAll(){
    results.empty++;
    answers.forEach(answer => {
        showTrueandFalse(answer);
    });
}

//makes the options untamperable after clicking on one of them
function untouchable(element) {
    let parent = element.parentElement;
    for(let child of parent.children){
        child.style.pointerEvents = "none";
    }
}

//it adds class "selected" to the option that user clicks on, it also runs showTrueandFalse()
function evaluateAnswers(answer){
    answer.classList.add("selected");

    showTrueandFalse(answer);
}


/*add a click listener to all the options presented and evaluates answer as soon as user 
clicks on one answer*/
answers.forEach(ans => {
    ans.addEventListener("click", () => {
        evaluateAnswers(ans);
        clearInterval(interval);
        timeDiv.innerText = "0";
    });
});

//functionality of next button
nextBtn.addEventListener("click", () => {
    goToNext("30");
});

//functionality of start button
startBtn.addEventListener("click", () => {
    startQuiz();
});

//functionality of again button
againBtn.addEventListener("click", () => {
    location.reload();
});

//updates the latest results and puts them in the html
function setResultBoard(){
    corrAns.innerHTML = `${results.answeredCorrect} <i class="far fa-check-circle">`;
    incorrAns.innerHTML = `${results.answeredIncorrect} <i class="far fa-times-circle">`;
    emptyAns.innerHTML = `${results.empty} <i class="far fa-circle">`;
}

//this changes some visual styles when clicked on start
function transitionToQuiz(){
    startTab.style.display = "none";
    document.querySelector("#q1").style.display = "flex";
    boardFooter.style.display = "block";
    progressBar.style.width = `${questionsPassed * (100 / questions.length)}%`;
    questionIndicator.innerHTML = `<b>${questionsPassed}</b> of ${questions.length} Questions`;
}

//the function that runs every second in interval variable
function Interval(){
    timeDiv.innerText--;
    if(timeDiv.innerText.length === 1) timeDiv.innerText = `0${timeDiv.innerText--}`;
    if(timeDiv.innerText <= 0) {
        timeDiv.innerText = 0;

        results.empty++;
        document.querySelectorAll(`#q${questionsPassed} .answer`).forEach(answer => {
            showTrueandFalse(answer);
        });
        clearInterval(interval);
    };
}

//sets interval and runs transitionToQuiz()
function startQuiz(){

    interval = setInterval(Interval , 1000); 

    transitionToQuiz();

}