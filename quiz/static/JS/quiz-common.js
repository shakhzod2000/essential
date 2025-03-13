// Common functions and variables to be used across files
    export let questionCount = parseInt(localStorage.getItem('questionCount')) || 0;
    export let userScore = parseInt(localStorage.getItem('userScore')) || 0;
    export let unitPopupStatus = parseInt(localStorage.getItem('unitPopupStatus')) || 0;
    export let activeLanguage = localStorage.getItem('activeLanguage');
    export let word = localStorage.getItem('word');
    
    const main = document.querySelector('.main');
    const optionList = document.querySelector('.option-list');
    const nextBtn = document.querySelector('.next-btn');
    const resultBox = document.querySelector('.result-box');

    export function clearAnsweredStates() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('answeredQuestion-'))
                localStorage.removeItem(key);
        });
    }

    export function updateQuestionCount() {
        questionCount++;
        localStorage.setItem('questionCount', questionCount);
    }

    export function showQuestions(index, questions) {
        const questionText = document.querySelector('.question-text');
        localStorage.setItem('word', questions[index].question);
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

        // Check if question was already answered
        const storedAnswer = localStorage.getItem('answeredQuestion-' + index);
        if (storedAnswer) {
            const answerData = JSON.parse(storedAnswer);
            // Disable all options
            options.forEach(option => option.classList.add('disabled'));

            // Mark selected and correct answers
            options.forEach(option => {
                // Highlight selected answer
                if (option.textContent === answerData.selected)
                    option.classList.add(answerData.isCorrect ? 'correct' : 'incorrect');
                
                if (option.textContent === questions[index].answer)
                    option.classList.add('correct');
            });
            // Activate next button, since question is answered
            nextBtn.classList.add('active');
        }

    }


    export function optionSelected(answer, questions) {
        let userAnswer = answer.textContent;
        let correctAnswer = questions[questionCount].answer;
        let allOptions = optionList.children.length; // '.children' gibt alle Kinderelemente eines Elements zurück.

        // Create answer state object
        const answerState = {
            answered: true,
            selected: userAnswer,
            isCorrect: (userAnswer === correctAnswer)
        };

        // Store answerState for curr question index
        localStorage.setItem('answeredQuestion-' + questionCount, JSON.stringify(answerState));

        if (userAnswer == correctAnswer) {
            answer.classList.add('correct');
            userScore += 1;
            localStorage.setItem('userScore', userScore);
            headerScore(questions);
        } else {
            answer.classList.add('incorrect');
            // Highlight the correct answer
            for (let i = 0; i < allOptions; i++)
                if (optionList.children[i].textContent == correctAnswer)
                    optionList.children[i].setAttribute('class', 'option correct');
        }
        // Disable all options
        for (let i = 0; i < allOptions; i++) {
            optionList.children[i].classList.add('disabled');
        }

        nextBtn.classList.add('active');
    }

    export function questionCounter(index, questions) {
        const questionTotal = document.querySelector('.question-total');
        if (activeLanguage == 'En')
            questionTotal.textContent = `${index} of ${questions.length} questions`;
        else
            questionTotal.textContent = `${index} von ${questions.length} Fragen`;
    }

    export function headerScore(questions) {
        const headerScoreText = document.querySelector('.header-score');
        if (activeLanguage == 'En')
            headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
        else
            headerScoreText.textContent = `Spielstand: ${userScore} / ${questions.length}`;
    }

    export function showResultBox(questions) {
        resultBox.classList.add('active');
        main.classList.remove('active');
        const scoreText = document.querySelector('.score-text');
        if (activeLanguage == 'En')
            scoreText.textContent = `You got ${userScore} out of ${questions.length} questions correct.`;
        else
            scoreText.textContent = `Du hast ${userScore} von ${questions.length} Fragen richtig beantwortet.`;
        
        const circularProgress = document.querySelector('.circular-progress');
        const progressValue = document.querySelector('.progress-value');
        
        let progressStartValue = -1;
        let progressEndValue = Math.round((userScore / questions.length) * 100);
        let speed = 20;
        
        let progress = setInterval(() => {
            progressStartValue++;
            progressValue.textContent = `${progressStartValue}%`;
            circularProgress.style.background = `conic-gradient(#5bf846 ${progressStartValue * 3.6}deg, white 0deg)`; // "style" ermöglicht, CSS-Regeln zu setzen oder zu ändern.
            if (progressStartValue == progressEndValue)
                clearInterval(progress);
        }, speed);
    }