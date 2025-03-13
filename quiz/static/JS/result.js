import { clearAnsweredStates, showResultBox } from './quiz-common.js';
import { getQuestions } from './quizDB.js';

let currUnit = localStorage.getItem('currUnit');

if (document.body.classList.contains('result-page')) {
    getQuestions(currUnit).then(questions => {
        if (questions && questions.length) {
            let activeLanguage = localStorage.getItem('activeLanguage') || 'En';
            const quizSection = document.querySelector('.quiz-section');
            const resultBox = document.querySelector('.result-box');
            const resultBoxTitle = document.querySelector('.result-box h2');
            const tryAgain = document.querySelector('.tryAgain-btn');
            const goHome = document.querySelector('.goHome-btn');
        
            quizSection.classList.add('active');
            
            if (activeLanguage == 'En') {
                resultBoxTitle.textContent = "Quiz Result!";
                goHome.textContent = "Go Home";
                tryAgain.textContent = "Try Again";
            } else {
                resultBoxTitle.textContent = "Quiz Ergebnis!";
                goHome.textContent = "Startseite";
                tryAgain.textContent = "Erneut versuchen";
            }
        
            tryAgain.onclick = () => {
                clearAnsweredStates();
                resultBox.classList.remove('active');
                localStorage.removeItem('questionCount');
                localStorage.removeItem('userScore');
                window.location.href = '/quiz-test/';
            }
        
            goHome.onclick = () => {
                clearAnsweredStates();
                resultBox.classList.remove('active');
                quizSection.classList.remove('active');
                localStorage.removeItem('questionCount');
                localStorage.removeItem('userScore');
                window.location.href = '/';
            }
        
            showResultBox(questions);

        } else {
            console.error('No questions found for unit:', currUnit);
        }
    }).catch(err => {
        console.error(err);
    });

}

// Disable double click on the page
document.addEventListener('dblclick', function(e){
    e.preventDefault();
});

