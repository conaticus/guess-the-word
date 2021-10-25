const playBtn = document.getElementById("play-btn");

const swipeDuration = 0.8;
let attempts = 10;
let correctGuesses = 0;
const guessedCharacters = [];

const swipeOutLeft = (elementId) => {
    document.body.style.overflowX = "hidden"; // Temporarily hide the scrollbar when moving elements outside of the view range

    const el = document.getElementById(elementId);
    el.style.animationName = "swipe-out-left";
    el.style.animationDuration = `${swipeDuration}s`;

    return new Promise((resolve) => {
        setTimeout(() => {
            document.body.style.overflowX = "visible";
            resolve(el);
        }, swipeDuration * 1000);
    });
};

const swipeInRight = (elementId) => {
    document.body.style.overflowX = "hidden";

    const el = document.getElementById(elementId);
    el.style.animationName = "swipe-in-right";
    el.style.animationDuration = `${swipeDuration}s`;

    return new Promise((resolve) => {
        setTimeout(() => {
            document.body.style.overflowX = "visible";
            resolve(el);
        }, swipeDuration * 1000);
    });
};

const startGame = async (word) => {
    const enterWordEl = await swipeOutLeft("enter-word");
    enterWordEl.remove();
    enterWordEl.style.display = "none";

    const mainGameDiv = document.getElementById("main-game");

    const attemptsH1 = document.getElementById("attempts");
    attemptsH1.innerText = `Attempts: ${attempts}`;

    for (character of word) {
        const letterPlaceholder = document.createElement("input");
        letterPlaceholder.type = "text";
        letterPlaceholder.maxLength = 1;
        letterPlaceholder.className = "letter-placeholder";
        letterPlaceholder.disabled = true;

        mainGameDiv.appendChild(letterPlaceholder);
    }

    mainGameDiv.appendChild(document.createElement("br"));

    const letterInput = document.createElement("input");
    letterInput.type = "text";
    letterInput.className = "letter-input";
    letterInput.maxLength = 1;
    letterInput.required = true;

    const letterSubmit = document.createElement("button");
    letterSubmit.style.display = "none";

    const wrongLetters = document.createElement("p");
    wrongLetters.innerHTML = "Wrong guesses:&nbsp";

    mainGameDiv.appendChild(letterInput);
    mainGameDiv.appendChild(wrongLetters);

    mainGameDiv.style.display = "block";
    await swipeInRight("main-game");

    const letterPlaceholders =
        document.getElementsByClassName("letter-placeholder");

    letterInput.focus();
    letterInput.oninput = (e) => {
        const guessedLetter = e.target.value;
        if (guessedCharacters.includes(guessedLetter)) {
            alert("You've already guessed this letter!");
            letterInput.value = "";
            return;
        }

        guessedCharacters.push(guessedLetter);

        let guessIsCorrect = false;

        for (let i = 0; i < letterPlaceholders.length; i++) {
            if (guessedLetter.toLowerCase() === word[i].toLowerCase()) {
                if (++correctGuesses === word.length) {
                    alert(
                        `Congratulations, you've won, the word was '${word}'.`
                    );
                    location.reload();
                }
                letterPlaceholders.item(i).value = word[i];
                guessIsCorrect = true;
            }
        }

        if (guessIsCorrect === false) {
            attempts--;

            wrongLetters.innerHTML += `${guessedLetter},&nbsp`;

            if (attempts === 0) {
                alert(`Oh no! You lost.. the word was '${word}'`);
                location.reload();
            }
            attemptsH1.innerText = `Attempts: ${attempts}`;
        }

        letterInput.value = "";
    };
};

const loadGame = async () => {
    const titleElement = await swipeOutLeft("title");
    titleElement.hidden = true;

    document.getElementById("enter-word").style.display = "block";
    await swipeInRight("enter-word");
    const wordInput = document.getElementById("word-input");
    wordInput.focus();

    wordInput.oninput = (e) => {
        console.log(e.target.value);
        if (e.target.value === " ") {
            e.target.value.slice(0, -1);
        }
    };

    document.getElementById("word-form").onsubmit = (e) => {
        e.preventDefault();
        const word = wordInput.value;
        startGame(word);
    };
};

playBtn.onclick = loadGame;
