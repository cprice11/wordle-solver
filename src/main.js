import { VALID_WORDS } from "./valid-words";
const body = document.querySelector('body')
const rows = document.querySelectorAll('.cell-row');
const keyboard = document.querySelectorAll('.keyboard-key');
let keyboardKeys = {}
const wordToGuess = "apple"; // replace this with a random word from a list
let currentRow = 0;
let currentCol = 0;
let currentGuess = [];
let keyboardLetters = new Set()
let keyboardAbsent = new Set()
let keyboardPresent = new Set()
let keyboardCorrect = new Set()


body.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    let keyValue = event.key;
    if (keyValue == 'Backspace') {
        removeLetter()
    } else if (keyValue == 'Enter') {
        checkGuess()
    } else {
        keyValue = keyValue.toLowerCase()
        if (keyValue.length == 1 && /^[a-z]/.test(keyValue)) {
            addLetter(keyValue)
        }
    }
})


keyboard.forEach((key) => {
    key.addEventListener('click', () => {
        const keyValue = key.dataset.key;
        if (keyValue === 'enter') {
            checkGuess();
        } else if (keyValue === 'backspace') {
            removeLetter();
        } else {
            addLetter(keyValue);
        }
    });
    keyboardKeys[key.dataset.key] = { "elem": key, "state": '' }
});

console.log(keyboardKeys)

function clearState(elem) {
    elem.classList.remove('entry', 'missing', 'present', 'correct')
}

function addLetter(letter) {
    console.log("add letter: ", letter, currentRow, currentCol)
    if (currentCol < 5 && currentRow < 6) {
        let cell = rows[currentRow].children[currentCol]
        cell.classList.add('entry')
        cell.textContent = letter;
        currentGuess[currentCol] = letter;
        currentCol++;
    }
}

function removeLetter() {
    if (currentCol > 0) {
        currentCol--;
        let cell = rows[currentRow].children[currentCol]
        cell.textContent = '';
        currentGuess[currentCol] = undefined;
        clearState(cell)
    }
}

function checkGuess() {
    const guess = currentGuess.join('').toLowerCase();
    if (currentGuess.length === 5) {
        if (VALID_WORDS.has(guess) == false) {
            alert(guess.toUpperCase() + " is not a valid word")
            return
        }
        evaluateGuess(guess);
        currentRow++;
        currentCol = 0;
        currentGuess = [];
        if (currentRow === 6) {
            alert("Game Over! The word was " + wordToGuess);
        }
    }

}

function evaluateGuess(guess) {
    let word = wordToGuess.toLowerCase().split('');
    guess = guess.toLowerCase().split('')
    for (let i = 0; i < 5; i++) {
        const cell = rows[currentRow].children[i];
        const keyboard = keyboardKeys[guess[i]];
        clearState(keyboard.elem)
        clearState(cell)
        if (guess[i] === word[i]) {
            keyboard.state = 'correct'
            keyboard.elem.classList.add('correct')
            cell.classList.add('correct');
            word[i] = '-';
            guess[i] = '_';
        }
    }
    for (let i = 0; i < 5; i++) {
        const cell = rows[currentRow].children[i];
        const keyboard = keyboardKeys[guess[i]];
        if (word.includes(guess[i])) {
            cell.classList.add('present');
            if (keyboard.state != 'correct') {
                keyboard.elem.classList.add('present')
                keyboard.state = 'present'
            }
            word[word.indexOf(guess[i])] = '-';
            guess[i] = '_';
        }
    }
    for (let i = 0; i < 5; i++) {
        const cell = rows[currentRow].children[i];
        const keyboard = keyboardKeys[guess[i]];
        if (guess[i] != '_') {
            cell.classList.add('absent');
            keyboard.elem.classList.add('absent')
            keyboard.state = 'absent'
        }
    }
}
