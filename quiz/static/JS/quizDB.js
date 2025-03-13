// open (or create) database called QuizDB with version 1
export function openQuizDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('QuizDB', 1);

        // This event fires upon first DB creation or upgrade
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            //Create object store named 'questionsStore' with 'unit' as key
            if (!db.objectStoreNames.contains('questionsStore')) {
                db.createObjectStore('questionsStore', { keyPath: 'unit' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject('Error opening IndexedDB');
        };
    });
}


// Save questions for a given unit
export function saveQuestions(unit, questions) {
    return openQuizDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('questionsStore', 'readwrite');
            const store = transaction.objectStore('questionsStore');

            // Use put() to add or update entry (keyed by unit)
            const request = store.put({ unit, questions });
            request.onsuccess = () => resolve();
            request.onerror = () => reject('Error saving questions');
        });
    });
}

//Retrieve questions for given unit
export function getQuestions(unit) {
    return openQuizDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('questionsStore', 'readonly');
            const store = transaction.objectStore('questionsStore');
            const request = store.get(unit);
            request.onsuccess = (event) => {
                // if found, return questions array, else return null
                resolve(event.target.result ? event.target.result.questions : null);
            };
            request.onerror = () => reject('Error retrieving questions');
        });
    });
}