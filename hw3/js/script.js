document.querySelector("#submitQuiz")
  .addEventListener("click", gradeQuiz);

let score = 0;
let goodScore = 80;

displayQ4Choices();
displayQ7Choices();

let attempts = localStorage.getItem("total_attempts");

if (attempts === null) {
  attempts = 0;
} else {
  attempts = Number(attempts);
}

document.querySelector("#totalAttempts").textContent =
  `Total Attempts: ${attempts}`;

function isFormValid() {
  let validationFbk =
    document.querySelector("#validationFbk");

  let q1Response =
    document.querySelector("#q1").value.trim();

  let q2Response =
    document.querySelector("#q2").value;

  let q3Answered =
    document.querySelector("#jackson").checked ||
    document.querySelector("#franklin").checked ||
    document.querySelector("#jefferson").checked ||
    document.querySelector("#roosevelt").checked;

  let q4Answered =
    document.querySelector("input[name='q4']:checked");

  let q5Response =
    document.querySelector("#q5").value;

  let q6Response =
    document.querySelector("#q6").value.trim();

  let q7Answered =
    document.querySelector("input[name='q7']:checked");

  let q8Answered =
    document.querySelector("#yellowstone").checked ||
    document.querySelector("#yosemite").checked ||
    document.querySelector("#disneyland").checked;

  let q9Response =
    document.querySelector("#q9").value;

  let q10Response =
    document.querySelector("#q10").value;

  if (q1Response === "") {
    validationFbk.textContent =
      "Question 1 was not answered";
    return false;
  }

  if (q2Response === "") {
    validationFbk.textContent =
      "Question 2 was not answered";
    return false;
  }

  if (!q3Answered) {
    validationFbk.textContent =
      "Question 3 was not answered";
    return false;
  }

  if (q4Answered === null) {
    validationFbk.textContent =
      "Question 4 was not answered";
    return false;
  }

  if (q5Response === "") {
    validationFbk.textContent =
      "Question 5 was not answered";
    return false;
  }

  if (q6Response === "") {
    validationFbk.textContent =
      "Question 6 was not answered";
    return false;
  }

  if (q7Answered === null) {
    validationFbk.textContent =
      "Question 7 was not answered";
    return false;
  }

  if (!q8Answered) {
    validationFbk.textContent =
      "Question 8 was not answered";
    return false;
  }

  if (q9Response === "") {
    validationFbk.textContent =
      "Question 9 was not answered";
    return false;
  }

  if (q10Response === "") {
    validationFbk.textContent =
      "Question 10 was not answered";
    return false;
  }

  validationFbk.textContent = "";
  return true;
}

function setMarkImage(index, imageName, altText) {
  let markContainer =
    document.querySelector(`#markImg${index}`);

  markContainer.textContent = "";

  let img = document.createElement("img");

  img.src = `img/${imageName}`;
  img.alt = altText;

  markContainer.appendChild(img);
}

function rightAnswer(index) {
  let feedback =
    document.querySelector(`#q${index}Feedback`);

  feedback.textContent = "Correct!";
  feedback.className = "feedback correct";

  setMarkImage(index, "checkmark.png", "Correct answer");

  score += 10;
}

function wrongAnswer(index) {
  let feedback =
    document.querySelector(`#q${index}Feedback`);

  feedback.textContent = "Incorrect!";
  feedback.className = "feedback incorrect";

  setMarkImage(index, "xmark.png", "Incorrect answer");
}

function gradeQuiz() {
  console.log("Grading quiz...");

  document.querySelector("#validationFbk")
    .textContent = "";

  if (!isFormValid()) {
    return;
  }

  score = 0;

  let q1Response = document
    .querySelector("#q1")
    .value
    .trim()
    .toLowerCase();

  let q2Response =
    document.querySelector("#q2").value;

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

  if (
    document.querySelector("#jefferson").checked &&
    document.querySelector("#roosevelt").checked &&
    !document.querySelector("#jackson").checked &&
    !document.querySelector("#franklin").checked
  ) {
    rightAnswer(3);
  } else {
    wrongAnswer(3);
  }

  let selectedQ4 =
    document.querySelector("input[name='q4']:checked");

  if (
    selectedQ4 !== null &&
    selectedQ4.value === "Rhode Island"
  ) {
    rightAnswer(4);
  } else {
    wrongAnswer(4);
  }

  let q5Response =
    document.querySelector("#q5").value;

  if (q5Response === "alaska") {
    rightAnswer(5);
  } else {
    wrongAnswer(5);
  }

  let q6Response = document
    .querySelector("#q6")
    .value
    .trim()
    .toLowerCase();

  if (q6Response === "florida") {
    rightAnswer(6);
  } else {
    wrongAnswer(6);
  }

  let selectedQ7 =
    document.querySelector("input[name='q7']:checked");

  if (
    selectedQ7 !== null &&
    selectedQ7.value === "Washington, D.C."
  ) {
    rightAnswer(7);
  } else {
    wrongAnswer(7);
  }

  if (
    document.querySelector("#yellowstone").checked &&
    document.querySelector("#yosemite").checked &&
    !document.querySelector("#disneyland").checked
  ) {
    rightAnswer(8);
  } else {
    wrongAnswer(8);
  }

  let q9Response =
    document.querySelector("#q9").value;

  if (q9Response === "arizona") {
    rightAnswer(9);
  } else {
    wrongAnswer(9);
  }

  let q10Response =
    document.querySelector("#q10").value;

  if (q10Response === "50") {
    rightAnswer(10);
  } else {
    wrongAnswer(10);
  }

  let totalScore =
    document.querySelector("#totalScore");

  totalScore.textContent =
    `Total Score: ${score}/100`;

  if (score > goodScore) {
    totalScore.className =
      "correctAnswer";

    totalScore.textContent +=
      " - Congratulations Magellan!";
  } else {
    totalScore.className =
      "incorrectAnswer";
  }

  attempts++;

  document.querySelector("#totalAttempts")
    .textContent = `Total Attempts: ${attempts}`;

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
  let q4ChoicesArray = [
    "Maine",
    "Rhode Island",
    "Maryland",
    "Delaware"
  ];

  displayRadioChoices(
    q4ChoicesArray,
    "#q4Choices",
    4
  );
}

function displayQ7Choices() {
  let q7ChoicesArray = [
    "New York City",
    "Washington, D.C.",
    "Philadelphia",
    "Los Angeles"
  ];

  displayRadioChoices(
    q7ChoicesArray,
    "#q7Choices",
    7
  );
}

function displayRadioChoices(radioChoicesArray, choicesContainerId, questionNumber) {
  shuffleArray(radioChoicesArray);

  let choicesContainer =
    document.querySelector(choicesContainerId);

  choicesContainer.textContent = "";

  for (let choice of radioChoicesArray) {
    let inputId =
      choice.toLowerCase().replaceAll(" ", "-");

    let input = document.createElement("input");

    input.type = "radio";
    input.name = `q${questionNumber}`;
    input.id = inputId;
    input.value = choice;
    input.className = "form-check-input";

    let label = document.createElement("label");

    label.htmlFor = inputId;
    label.textContent = choice;
    label.className = "form-check-label";

    choicesContainer.appendChild(input);
    choicesContainer.appendChild(label);
    choicesContainer.appendChild(
      document.createTextNode(" ")
    );
  }
}