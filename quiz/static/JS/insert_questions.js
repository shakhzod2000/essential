// insert_questions.js
import mysql from 'mysql';
import allQuestions_2 from './allQuestions_2.js';

const connection = mysql.createConnection({
    host: 'essential-db-1.cnoi0w6aiqm7.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '1ecg&xDvx',
    database: 'essential_words'
});

connection.connect();

async function insertQuestions() {
    try {
        const quizId = await new Promise((resolve, reject) => {
            connection.query('SELECT id FROM quizzes WHERE book = ?', ['E3'], function (error, results) {
                if (error) return reject(error);
                console.log('Quiz inserted with ID:', results.insertId);
                resolve(results[0].id);
            });
        });

        let questionCount = 0;

        for (let unitNumber = 1; unitNumber <= 30; unitNumber++) {
            const questionsDe = allQuestions_2[`questions${unitNumber}`] || [];

            console.log(`Processing unit ${unitNumber}:`);

            // Insert German questions
            for (const question of questionsDe) {
                console.log('Inserting German question:', question);
                if (questionCount >= 600) break;
                questionCount++;

                const questionId = await new Promise((resolve, reject) => {
                    connection.query(
                        'INSERT INTO questions (quiz_id, numb, question, answer, unit, language) VALUES (?, ?, ?, ?, ?, ?)',
                        [quizId, question.numb, question.question, question.answer, unitNumber, 'De'],
                        function (error, results) {
                            if (error) return reject(error);
                            console.log('Question inserted with ID:', results.insertId);
                            resolve(results.insertId);
                        }
                    );
                });

                for (const option of question.options) {
                    console.log('Inserting option:', option, 'for question ID:', questionId);
                    await new Promise((resolve, reject) => {
                        connection.query(
                            'INSERT INTO options (question_id, option_text) VALUES (?, ?)',
                            [questionId, option],
                            function (error) {
                                if (error) return reject(error);
                                console.log('Option inserted for question ID:', questionId);
                                resolve();
                            }
                        );
                    });
                }
            }
        }

        questionCount = 0; // Reset question count

        for (let unitNumber = 1; unitNumber <= 30; unitNumber++) {
            const questionsEn = allQuestions_2[`savollar${unitNumber}`] || [];

            // Insert English/Uzbek questions
            for (const question of questionsEn) {
                console.log('Inserting English/Uzbek question:', question);
                if (questionCount >= 600) break;
                questionCount++;

                const questionId = await new Promise((resolve, reject) => {
                    connection.query(
                        'INSERT INTO questions (quiz_id, numb, question, answer, unit, language) VALUES (?, ?, ?, ?, ?, ?)',
                        [quizId, question.numb, question.question, question.answer, unitNumber, 'En'],
                        function (error, results) {
                            if (error) return reject(error);
                            console.log('Question inserted with ID:', results.insertId);
                            resolve(results.insertId);
                        }
                    );
                });

                for (const option of question.options) {
                    console.log('Inserting option:', option, 'for question ID:', questionId);
                    await new Promise((resolve, reject) => {
                        connection.query(
                            'INSERT INTO options (question_id, option_text) VALUES (?, ?)',
                            [questionId, option],
                            function (error) {
                                if (error) return reject(error);
                                console.log('Option inserted for question ID:', questionId);
                                resolve();
                            }
                        );
                    });
                }
            }
        }

        console.log(`Total questions inserted: ${questionCount} * 2`);
    } catch (error) {
        console.error('Error inserting questions:', error);
    } finally {
        connection.end();
    }
}

insertQuestions();
