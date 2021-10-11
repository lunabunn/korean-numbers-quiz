const settings = document.getElementById("settings");
const settingsPane = document.getElementById("settings-pane");
const maxUnit = document.getElementById("unit-select");
const showCommas = document.getElementById("commas-select");
const number = document.getElementById("number");
const input = document.getElementById("input");
const explanation = document.getElementById("explanation");
const next = document.getElementById("next");

let maxValue = 99999999;
let value;
randomizeValue();
updateNumber();
let explaining = false;

settings.addEventListener("click", e => {
    settingsPane.classList.toggle("show");
    e.stopPropagation();
});

document.body.addEventListener("click", () => {
    settingsPane.classList.remove("show");
});

settingsPane.addEventListener("click", e => {
    e.stopPropagation();
});

maxUnit.addEventListener("change", () => {
    maxValue = parseInt(maxUnit.value);
});

showCommas.addEventListener("change", () => {
    if (showCommas.value === "three") {
        number.classList.remove("show-fourcommas");
        number.classList.add("show-threecommas");
    } else if (showCommas.value === "four") {
        number.classList.add("show-fourcommas");
        number.classList.remove("show-threecommas");
    } else {
        number.classList.remove("show-fourcommas");
        number.classList.remove("show-threecommas");
    }
});

input.addEventListener("input", () => {
    if (input.innerText === "\n") {
        input.innerHTML = "";
    }
});

input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        next.click();
    }
});

next.addEventListener("click", () => {
    if (explaining) {
        input.contentEditable = true;
        randomizeValue();
        updateNumber();
        input.innerHTML = "";
        explanation.innerHTML = "";
        explaining = false;
    } else {
        input.contentEditable = false;
        const answer = toKrNumber(value);
        if (input.innerText.trim() === answer) {
            explanation.className = "correct";
            explanation.innerHTML = getCorrectMessage();
        } else {
            explanation.className = "wrong";
            explanation.innerHTML = p(getWrongMessage()) + p(`The correct answer was ${answer}.`);
        }
        explaining = true;
    }
});

function randomizeValue() {
    value = Math.floor(Math.random() * maxValue) + 1;
}

function updateNumber() {
    console.log(value);

    let valueString = value.toString();
    number.innerHTML = "";

    for (let i = 0; i < valueString.length; i++) {
        if (i != 0 && i != valueString.length - 1 && i % 4 == 0) {
            number.innerHTML = "<span class=\"fourcomma\">,</span>" + number.innerHTML;
        }
        if (i != 0 && i != valueString.length - 1 && i % 3 == 0) {
            number.innerHTML = "<span class=\"threecomma\">,</span>" + number.innerHTML;
        }
        number.innerHTML = valueString.charAt(valueString.length - i - 1) + number.innerHTML;
    }
}

/// Converts a number to a Korean number string
function toKrNumber(x) {
    const bigUnits = ["", "만", "억"];
    const smallUnits = ["", "십", "백", "천"];
    const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];

    let correct = "";
    let s = x.toString().split("");
    for (let i = 0; i < bigUnits.length + 1 && s.length > 0; i++) {
        correct = bigUnits[i] + " " + correct;
        for (let j = 0; j < smallUnits.length && s.length > 0; j++) {
            let digit = s.pop();
            if (digit == 0) continue;
            correct = digits[digit] + smallUnits[j] + correct;
            if (j != 0 && correct.charAt(0) == "일") correct = correct.substr(1);
        }
        if (i != 0 && correct.charAt(0) == "일") correct = correct.substr(1);
    }

    return correct.substr(0, correct.length - 1);
}

/// Returns a random correct answer message
function getCorrectMessage() {
    const correctMessages = ["Keep it up!", "You got it!"];
    return correctMessages[Math.floor(Math.random() * correctMessages.length)];
}

/// Returns a random wrong answer message
function getWrongMessage() {
    const wrongMessages = ["Try again!", "Better luck next time!"];
    return wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
}

/// Returns the given string wrapped in a <p> tag
function p(s) {
    return "<p>" + s + "</p>";
}