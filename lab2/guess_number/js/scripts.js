//Event listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

// Global variables
let randomNumber;
let attempts = 0;
let maxAttempts = 7;
let wins = 0;
let losses = 0;

initializeGame()

// let enter key activate the guess button
document.querySelector("#playerGuess").addEventListener("keydown", function (event) {
  if (event.key === "Enter" && attempts < maxAttempts) {
    document.querySelector("#guessBtn").click();
  }
});

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log(randomNumber);
    attempts = 0;

    // hiding the reset button
    document.querySelector("#resetBtn").style.display = "none";

    // showing the guess button
    document.querySelector("#guessBtn").style.display = "inline";

    // clearing and adding focus to textbox
    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus();
    playerGuess.value = "";
    document.querySelector("#playerGuess").focus();

    // clearing the feedback
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";

    // clearing the previous guesses
    document.querySelector("#guesses").textContent = "";

    // clearing the remaining attempts
    document.querySelector("#remainingAttempts").textContent = "";
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = ""; // Clear previous feedback
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    if (guess < 1 || guess > 99) {
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return;
    }

    //game logic
    attempts++;
    console.log("Attempts: " + attempts);
    feedback.style.color = "orange";
    if (guess == randomNumber) {
        feedback.textContent = "You guessed it! You Won!";
        feedback.style.color = "darkGreen";
        // add up a win
        wins++;
        document.querySelector("#wins").textContent = wins;

        gameOver()
    } else {
        // add the guess to the list of previous guesses
        let previousGuesses = document.querySelector("#guesses");
        previousGuesses.textContent += guess + " ";
        if (attempts >= maxAttempts) {
            feedback.textContent = "Sorry, you lost! The number was " + randomNumber;
            feedback.style.color = "red";
            // add up a loss
            losses++;
            document.querySelector("#losses").textContent = losses;
            gameOver();
        } else if ( guess > randomNumber) {
            feedback.textContent = "Guess was high";
        } else {
            feedback.textContent = "Guess was low";
        }
        document.querySelector("#remainingAttempts").textContent = "Remaining attempts: " + (maxAttempts - attempts);
        
        // clear the input field after each guess
        document.querySelector("#playerGuess").value = "";
    }

    // set focus back on input field
    document.querySelector("#playerGuess").focus();
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none"; // hides the Guess button
    resetBtn.style.display = "inline"; // displays Reset button
    // set focus on reset button
    resetBtn.focus();
}