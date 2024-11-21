//script.js
const dynamicText = document.querySelector('.home-content p');
const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const germanBtn = document.querySelector('.german-btn');
const englishBtn = document.querySelector('.english-btn');
const essentialsPopup = document.querySelector('.essentials-popup');
const EssPopupTitle = document.querySelector('.essentials-popup h2');
const essentialsBtnContainers = document.querySelectorAll('.essentials-btn');
const errorPopup = document.querySelector('.error-popup');
const errorPopupTitle = document.querySelector('.error-popup h2');
const OKBtn = document.querySelector('.OK-btn');
const backToLang = document.querySelector('.backToLang-btn');
const unitPopup = document.querySelector('.unit-popup');
const backToEss = document.querySelector('.backToEss-btn');
const unitPopupEn = document.querySelector('.unit-popup-en');
const backToEssEn = document.querySelector('.backToEssEn-btn');
const DeBtnUnit = document.querySelectorAll('.unit-container .unit');
const EnBtnUnit = document.querySelectorAll('.unit-container-en .unit');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const optionList = document.querySelector('.option-list');
const backToUnit = document.querySelector('.backToUnit-btn');
const backToUnitEn = document.querySelector('.backToUnit-btn');
const nextBtn = document.querySelector('.next-btn');
const resultBox = document.querySelector('.result-box');
const resultBoxTitle = document.querySelector('.result-box h2');
const tryAgain = document.querySelector('.tryAgain-btn');
const goHome = document.querySelector('.goHome-btn');

let questionCount = 0;
let questionNumb = 1;
let userScore = 0;
let questions = [];
let activeLanguage;
let activeUnit;
let unit;
let language;
let book;


var options = {
        strings: [
            "Learn the words with fun!", 
            "Lerne die Wörter mit Spaß!", 
            "So'zlarni maroq bilan o'rganing!"],
        typeSpeed: 50,
        backSpeed: 50,
        backDelay: 1500,
        startDelay: 0,
        loop: true,
        showCursor: false,
        smartBackspace: false,
        cursorChar: '|',
        autoInsertCss: true,
        loopCount: Infinity,
};

var typed = new Typed(".home-content p", options);

startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}

germanBtn.onclick = () => {
    popupInfo.classList.remove('active');
    essentialsPopup.classList.add('active');
    activeLanguage = 'De';
    translate();
}

englishBtn.onclick = () => {
    popupInfo.classList.remove('active');
    essentialsPopup.classList.add('active');
    activeLanguage = 'En';
    translate();
}

function translate() {
    if (activeLanguage == 'En') {
        EssPopupTitle.textContent = "Select desired book to practise";
        backToLang.textContent = "Back";
        backToUnit.textContent = "Back"
        nextBtn.textContent = "Next";
        resultBoxTitle.textContent = "Quiz Result!";
        goHome.textContent = "Go Home";
        tryAgain.textContent = "Try Again";
        errorPopupTitle.textContent = "Not available yet";
    } else {
        EssPopupTitle.textContent = "Wähle gewünschtes Buch zu üben";
        backToLang.textContent = "Zurück";
        backToUnit.textContent = "Zurück"
        nextBtn.textContent = "Weiter";
        resultBoxTitle.textContent = "Quiz Ergebnis!";
        goHome.textContent = "Startseite";
        tryAgain.textContent = "Erneut versuchen";
        errorPopupTitle.textContent = "Noch nicht verfügbar";
    }
}

exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}

function onEssentialClick(event) {
        book = event.target.classList[1];
        if (!event.target.classList.contains('E1') && 
            !event.target.classList.contains('E2') &&
            !event.target.classList.contains('E3')) {
            errorPopup.classList.add('active');
            OKBtn.onclick = () => {
                errorPopup.classList.remove('active');
            }
            return;
        }
        essentialsPopup.classList.remove('active');
        if (activeLanguage == 'De') 
            unitPopup.classList.add('active');
        else
            unitPopupEn.classList.add('active');
}

essentialsBtnContainers.forEach(container => {
    container.addEventListener('click', onEssentialClick);
});

backToLang.onclick = () => {
    popupInfo.classList.add('active');
    essentialsPopup.classList.remove('active');
}

DeBtnUnit.forEach(button => {
    button.onclick = async (event) => {
        unit = event.target.textContent; // Get unit number from button text
        language = 'De';

        if (unit && language) {
            try {
                const response = await axios.get(`api/questions?unit=${unit}&language=${language}&book=${book}`);
                questions = response.data; // access questions array from the response data
                console.log(questions);
                startQuiz(questions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        } else
            console.log('Unit or language not provided');
    }
});

backToEss.onclick = () => {
    essentialsPopup.classList.add('active');
    if (activeLanguage == 'De')
        unitPopup.classList.remove('active');
    else
        unitPopupEn.classList.remove('active');
}

// Event listener for English unit buttons
EnBtnUnit.forEach(button => {
    button.onclick = async (event) => {
        unit = event.target.textContent; // Get unit number from button text
        language = 'En';

        if (unit && language) {
            try {
                const response = await axios.get(`api/questions?unit=${unit}&language=${language}&book=${book}`);
                questions = response.data;
                console.log(questions);
                startQuiz(questions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        } else
            console.log('Unit or language not provided');
    };
});

backToEssEn.onclick = () => {
    essentialsPopup.classList.add('active');
    unitPopupEn.classList.remove('active');
}

async function startQuiz(questions) {
    if (language == 'De') {
        unitPopup.classList.remove('active');
        backToUnit.classList.add('active');
    } else {
        unitPopupEn.classList.remove('active');
        backToUnitEn.classList.add('active');
    }
    main.classList.remove('active');
    quizSection.classList.add('active');
    quizBox.classList.add('active');
    
    showQuestions(0, questions);
    questionCounter(1, questions.length);
    headerScore();
}

backToUnit.onclick = () => {
    quizSection.classList.remove('active');
    main.classList.add('active');
    nextBtn.classList.remove('active');
    
    if (language == 'De')
        unitPopup.classList.add('active');
    else
        unitPopupEn.classList.add('active');
        
    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
}

nextBtn.onclick = () => {
    console.log(`questionCount:${questionCount}, questions.length:${questions.length}, questionNumb:${questionNumb}`)
    if (questionCount < questions.length - 1) { // -1, weil Array bei 0 anfängt;  
        questionCount++;
        showQuestions(questionCount, questions);
        questionNumb++;
        questionCounter(questionNumb, questions.length);
        nextBtn.classList.remove('active');
    }
    else
        showResultBox();
}

tryAgain.onclick = () => {
    quizBox.classList.add('active');
    resultBox.classList.remove('active');
    nextBtn.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;

    showQuestions(questionCount, questions);
    questionCounter(questionNumb, questions.length);
    headerScore();
}

goHome.onclick = () => {
    resultBox.classList.remove('active');
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
}

// Fragen und Optionen aus dem Array holen
function showQuestions(index, questions) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;
    let optionTag = questions[index].options.map(option => 
        `<div class="option"><span>${option}</span></div>`).join('');
    
    optionList.innerHTML = optionTag;
    // Add event listeners to options
    const options = document.querySelectorAll('.option');
    options.forEach((option) => {
        option.addEventListener('click', function() {
            optionSelected(this, questions);
        });
    });
}

function optionSelected(answer, questions) {
    let userAnswer = answer.textContent;
    let correctAnswer = questions[questionCount].answer;
    let allOptions = optionList.children.length; // '.children' gibt alle Kinderelemente eines Elements zurück.
    
    if (userAnswer == correctAnswer) {
        answer.classList.add('correct');
        userScore += 1;
        headerScore();
    } else {
        answer.classList.add('incorrect');
        // korrekte Antwort hervorheben
        for (let i = 0; i < allOptions; i++)
            if (optionList.children[i].textContent == correctAnswer)
                optionList.children[i].setAttribute('class', 'option correct');
    }
    // wenn Nutzer ausgewählt hat, dann keine Auswahl mehr möglich
    for (let i = 0; i < allOptions; i++) 
        optionList.children[i].classList.add('disabled');

    nextBtn.classList.add('active');
}

function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    if (activeLanguage == 'En')
        questionTotal.textContent = `${index} of ${questions.length} questions`;
    else
        questionTotal.textContent = `${index} von ${questions.length} Fragen`;
}

function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    if (activeLanguage == 'En')
        headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
    else
        headerScoreText.textContent = `Spielstand: ${userScore} / ${questions.length}`;
}

function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');
    
    const scoreText = document.querySelector('.score-text');
    if (activeLanguage == 'En')
        scoreText.textContent = `You got ${userScore} out of ${questions.length} questions correct.`;
    else
        scoreText.textContent = `Du hast ${userScore} von ${questions.length} Fragen richtig beantwortet.`;
    
    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    
    let progressStartValue = -1;
    let progressEndValue = (userScore / questions.length) * 100;
    let speed = 20;
    
    let progress = setInterval(() => {
        progressStartValue++;
        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#5bf846 ${progressStartValue * 3.6}deg, white 0deg)`; // "style" ermöglicht, CSS-Regeln zu setzen oder zu ändern.
        if (progressStartValue == progressEndValue)
            clearInterval(progress);
    }, speed);
}

// Disable double click on the page
document.addEventListener('dblclick',function(e){
    e.preventDefault();
});

