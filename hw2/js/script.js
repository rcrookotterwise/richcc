document.querySelector("button").addEventListener("click", gradeQuiz);

function isFormValid() {
    let isValid = true;
    let q1Response = document.querySelector("#q1").value;
    let validationFbk = document.querySelector("#validationFbk");

    if (q1Response === "") {
        isValid = false;
        validationFbk.textContent = "Question 1 was not answered";
    }

    return isValid;
}

let score = 0;

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
    
    document.querySelector("#totalScore").textContent = `Total Score: ${score}`;

}
