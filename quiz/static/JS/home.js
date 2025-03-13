import { unitPopupStatus, clearAnsweredStates } from './quiz-common.js';
import { saveQuestions } from './quizDB.js';

if (document.body.classList.contains('home-page')) {
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
    const unitBtn = document.querySelectorAll('.unit-container .unit');


    let questions = [];
    let activeLanguage = localStorage.getItem('activeLanguage');
    let language;
    let book = localStorage.getItem('book');
    let unit = localStorage.getItem('unit');


    if (unitPopupStatus == 1) {
        translate();
        main.classList.add('active');
        unitPopup.classList.add('active');
    }

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
        localStorage.setItem('activeLanguage', 'De');
        activeLanguage = localStorage.getItem('activeLanguage');
        translate();
    }
    
    englishBtn.onclick = () => {
        popupInfo.classList.remove('active');
        essentialsPopup.classList.add('active');
        localStorage.setItem('activeLanguage', 'En');
        activeLanguage = localStorage.getItem('activeLanguage');
        translate();
    }

    function translate() {
        if (activeLanguage == 'En') {
            EssPopupTitle.textContent = "Select desired book to practise";
            backToLang.textContent = "Back";
            errorPopupTitle.textContent = "Not available yet";
            unitPopup.querySelector('h2').textContent = 'Choose the unit';
            backToEss.textContent = 'Back';
        } else {
            EssPopupTitle.textContent = "Wähle gewünschtes Buch zu üben";
            backToLang.textContent = "Zurück";
            errorPopupTitle.textContent = "Noch nicht verfügbar";
            unitPopup.querySelector('h2').textContent = 'Wähle eine Lektion';
            backToEss.textContent = 'Zurück';
        }
    }

    exitBtn.onclick = () => {
        popupInfo.classList.remove('active');
        main.classList.remove('active');
    }

    function onEssentialClick(event) {
        localStorage.setItem('book', event.target.classList[1]);
        book = localStorage.getItem('book');
        if (event.target.classList.contains('E5') ||
            event.target.classList.contains('E6')) {
            errorPopup.classList.add('active');
            OKBtn.onclick = () => {
                errorPopup.classList.remove('active');
            }
            return;
        }
        essentialsPopup.classList.remove('active');
        unitPopup.classList.add('active');
    }

    essentialsBtnContainers.forEach(container => {
        container.addEventListener('click', onEssentialClick);
    });

    backToLang.onclick = () => {
        popupInfo.classList.add('active');
        essentialsPopup.classList.remove('active');
    }

    unitBtn.forEach(button => {
        button.onclick = async (event) => {
            localStorage.setItem('unit', event.target.textContent); // Get unit number from button text
            unit = localStorage.getItem('unit');
            language = activeLanguage;

            if (unit && language) {
                try {
                    const response = await axios.get(`/api/questions?unit=${unit}&language=${language}&book=${book}`);
                    questions = response.data; // questions array from the response data(API)

                    // Save questions array to IndexedDB using unit as key
                    await saveQuestions(unit, questions);

                    // Store current unit in localStorage to know which one to load in quiz.js
                    localStorage.setItem('currUnit', unit);
                    startQuiz();
                } catch (error) {
                    console.error('Error fetching questions:', error);
                }
            } else
                console.log('Unit or language not provided');
        }
    });

    backToEss.onclick = () => {
        translate();
        unitPopup.classList.remove('active');
        essentialsPopup.classList.add('active');
        localStorage.removeItem('unitPopupStatus');
    }

    async function startQuiz() {
        clearAnsweredStates();
        localStorage.removeItem('unitPopupStatus');
        localStorage.removeItem('questionCount');
        localStorage.removeItem('userScore');
        localStorage.setItem('activeLanguage', activeLanguage);
        unitPopup.classList.remove('active');
        main.classList.remove('active');
        window.location.href = '/quiz-test/';
    }

}