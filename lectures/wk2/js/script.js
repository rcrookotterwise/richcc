// alert("Hello, World!");

// assign variables
let score = 60;
let today = new Date();
let year = today.getFullYear();

// use console to show variables
console.log("These are the variables");
console.dir({ score, today, year });

let month = today.getMonth();
console.dir({ month });
if (month === 10) {
    console.log("It's November");
} else {
    console.log("It's not November");
}

// get the h1 element from the document anywhere in the document
let element = document.querySelector("h1");
console.dir({ element });
addDateTime(element);

// add a button with inline event to display the date on click
let button = document.createElement("button");
button.textContent = "Display Date";
button.addEventListener("click", function() {
    addDateTime(element);
});
element.appendChild(button);

// add an event listener to the h1 element to display the date on click
element.addEventListener("click", function() {
    addDateTime(element);
});

// add an event listener to the change color button
let textColorButton = document.getElementById("textColorButton");
let textColorInput = document.getElementById("textColor");
textColorButton.addEventListener("click", function() {
    let color = textColorInput.value;
    document.querySelector("body").style.color = color;
});

let firstName = "Juan";
let lastName = "Doe";
let fullName = "Welcome " + firstName + " " + lastName + "!";
console.log(fullName);

function addDateTime(element) {
    // append the current date and time to the element in an h2 tag
    let h2 = document.createElement("h2");
    h2.textContent = today.toDateString() + " " + today.toLocaleTimeString();
    element.appendChild(h2);
}