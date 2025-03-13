import { getQuestions } from './quizDB.js';

import { questionCount, updateQuestionCount, showQuestions, questionCounter, headerScore, clearAnsweredStates, word } from './quiz-common.js';

let currUnit = localStorage.getItem('currUnit');

if (document.body.classList.contains('quiz-page')) {
// Retrieve questions from IndexedDB for curr unit
    getQuestions(currUnit).then(questions => {
        if (questions && questions.length) {
            let questionNumb = questionCount + 1;
            const main = document.querySelector('.main');
            const quizSection = document.querySelector('.quiz-section');
            const quizBox = document.querySelector('.quiz-box');
            const audioBtn = document.querySelectorAll('.question-line .audio')
            const backToUnit = document.querySelector('.backToUnit-btn');
            const nextBtn = document.querySelector('.next-btn');
            let activeLanguage = localStorage.getItem('activeLanguage') || 'En';
        
            if (activeLanguage == 'En') {
                backToUnit.textContent = "Back"
                nextBtn.textContent = "Next";
            } else {
                backToUnit.textContent = "Zurück"
                nextBtn.textContent = "Weiter";
            }
        
            backToUnit.classList.add('active');
            main.classList.remove('active');
            quizSection.classList.add('active');
            quizBox.classList.add('active');
    
            showQuestions(questionCount, questions);
            questionCounter(questionNumb, questions);
            headerScore(questions);
            
            audioBtn.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const word = localStorage.getItem('word');
                    const accent = event.currentTarget.getAttribute('data-accent');
                    const book = localStorage.getItem('book');
                    const unit = localStorage.getItem('unit');

                    if (word && accent && book && unit) {
                        try {
                            const response = await axios.get(`/api/tts/?word=${encodeURIComponent(word)}&accent=${encodeURIComponent(accent)}&book=${encodeURIComponent(book)}&unit=${encodeURIComponent(unit)}`);
    
                            if (response.data && response.data.url) {
                                const audio = new Audio(response.data.url);
                                audio.play();
                            }
                        } catch (error) {
                            console.error('Error fetching pronunciation', error);
                        }
                    }
                });
            });


            backToUnit.onclick = () => {
                clearAnsweredStates();
                quizSection.classList.remove('active');
                backToUnit.classList.remove('active');
                nextBtn.classList.remove('active');
                main.classList.add('active');
                localStorage.setItem('unitPopupStatus', 1);
                localStorage.removeItem('questionCount');
                localStorage.removeItem('userScore');
                window.location.href = '/';
            }
        
            nextBtn.onclick = () => {
                if (questionCount < questions.length - 1) {
                    updateQuestionCount(); // Increment and store questionCount
                    showQuestions(questionCount, questions);
                    questionCounter(questionCount + 1, questions);
                    nextBtn.classList.remove('active');
                } else {
                    quizBox.classList.remove('active');
                    window.location.href = '/quiz-result/';
                }
            }
        } else {
            console.error('No questions found for unit:', currUnit);
        }
    }).catch(err => {
        console.error(err);
    });
}
