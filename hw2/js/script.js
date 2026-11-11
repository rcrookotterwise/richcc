document.querySelector("button").addEventListener("click", gradeQuiz);

let score = 0;
let goodScore = 80;

displayQ4Choices();

// create a global attempts variable and store it using localStorage
let attempts = localStorage.getItem("total_attempts");

if (attempts === null) {
  attempts = 0;
} else {
  attempts = Number(attempts);
}

function isFormValid() {
  let validationFbk = document.querySelector("#validationFbk");
  let messages = [];

  let q1Response = document.querySelector("#q1").value.trim();
  let q2Response = document.querySelector("#q2").value;
  let q3Answered =
    document.querySelector("#Jefferson").checked ||
    document.querySelector("#Roosevelt").checked ||
    document.querySelector("#Jackson").checked ||
    document.querySelector("#Franklin").checked;
  let q4Answered = document.querySelector("input[name='q4']:checked");

  if (q1Response === "") messages.push("Question 1");
  if (q2Response === "") messages.push("Question 2");
  if (!q3Answered) messages.push("Question 3");
  if (q4Answered === null) messages.push("Question 4");

  if (messages.length > 0) {
    validationFbk.textContent =
      messages.join(", ") + " must be answered.";
    return false;
  }

  validationFbk.textContent = "";
  return true;
}

function setMarkImage(index, imageName, altText) {
  let markContainer = document.querySelector(`#markImg${index}`);
  markContainer.textContent = "";

  let img = document.createElement("img");
  img.src = `img/${imageName}`;
  img.alt = altText;
  markContainer.appendChild(img);
}

function rightAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Correct!";
  feedback.className = "bg-success text-white";
  setMarkImage(index, "checkmark.png", "Checkmark");
  score += 20;
}

function wrongAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Incorrect!";
  feedback.className = "bg-warning text-white";
  setMarkImage(index, "xmark.png", "X mark");
}

function gradeQuiz() {
    console.log("Grading quiz...");
    document.querySelector("#validationFbk").textContent = "";
    
    if (!isFormValid()) {
        return;
    }

    score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q2Response = document.querySelector("#q2").value;

    if (q1Response === "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }

    if (q2Response === "mo") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    if (document.querySelector("#Jefferson").checked &&
      document.querySelector("#Roosevelt").checked &&
      !document.querySelector("#Jackson").checked &&
      !document.querySelector("#Franklin").checked) {
      rightAnswer(3);
    } else {
      wrongAnswer(3);
    }

    let selectedQ4 = document.querySelector("input[name=q4]:checked");

    if (selectedQ4 !== null && selectedQ4.value === "Rhode Island") {
      rightAnswer(4);
    } else {
      wrongAnswer(4);
    }
    
    let totalScore = document.querySelector("#totalScore");
    totalScore.textContent = `Total Score: ${score}`;
    if (score >= goodScore) {
        totalScore.className = "correctAnswer";
        totalScore.textContent += " - Congratulations Magellan!";

    } else {
        totalScore.className = "incorrectAnswer";
    }
    

    // update the global attempts variable
    attempts++;
    document.querySelector("#totalAttempts").textContent = `Total Attempts: ${attempts}`;
    localStorage.setItem("total_attempts", attempts);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function displayQ4Choices() {
  let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
  shuffleArray(q4ChoicesArray);

  let choicesContainer = document.querySelector("#q4Choices");
  choicesContainer.textContent = "";

  for (let choice of q4ChoicesArray) {
    let input = document.createElement("input");
    input.type = "radio";
    input.name = "q4";
    input.id = choice;
    input.value = choice;

    let label = document.createElement("label");
    label.htmlFor = choice;
    label.textContent = choice;

    choicesContainer.appendChild(input);
    choicesContainer.appendChild(label);
    choicesContainer.appendChild(document.createTextNode(" "));
  }
}