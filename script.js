console.log("Start Game");

// Get the start button and add an event listener
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

// ===== COLOR MIXING RULES =====
// Basic Round
let basicColorMixingRules = [
    { color1: "red", color2: "blue", result: "purple" },
    { color1: "red", color2: "yellow", result: "orange" },
    { color1: "blue", color2: "yellow", result: "green" }
];

// Hard Round
let complexColorMixingRules = [
    { color1: "red", color2: "white", result: "pink" },
    { color1: "blue", color2: "white", result: "light-blue" },
    { color1: "green", color2: "white", result: "light-green" },
    { color1: "purple", color2: "white", result: "lavender" },
    { color1: "orange", color2: "white", result: "peach" },
    { color1: "yellow", color2: "white", result: "cream" },
    { color1: "red", color2: "black", result: "maroon" },
    { color1: "blue", color2: "black", result: "navy" },
    { color1: "green", color2: "black", result: "dark-green" },
    { color1: "purple", color2: "black", result: "dark-purple" },
    { color1: "orange", color2: "black", result: "brown" },
    { color1: "yellow", color2: "black", result: "olive" },
    { color1: "red", color2: "orange", result: "red-orange" },
    { color1: "yellow", color2: "orange", result: "yellow-orange" },
    { color1: "yellow", color2: "green", result: "yellow-green" },
    { color1: "blue", color2: "green", result: "teal" },
    { color1: "blue", color2: "purple", result: "indigo" },
    { color1: "red", color2: "purple", result: "magenta" },
    { color1: "red", color2: "green", result: "brown" },
    { color1: "white", color2: "black", result: "grey" }
];

// Game variables
let correctInARow = 0;
let currentAnswer = "";
let askedQuestions = [];
let currentRound = "basic";

// ===== MIXING FUNCTIONS =====

// Function to mix two colors using the correct rules
function mixTwoColors(color1, color2) {
    let rulesToUse = [];
    
    if (currentRound === "basic") {
        rulesToUse = basicColorMixingRules;
    } else {
        rulesToUse = basicColorMixingRules.concat(complexColorMixingRules);
    }
    
    for (let i = 0; i < rulesToUse.length; i++) {
        let rule = rulesToUse[i];
        
        if ((color1 === rule.color1 && color2 === rule.color2) || 
            (color1 === rule.color2 && color2 === rule.color1)) {
            return rule.result;
        }
    }
    
    return "unknown";
}

// ===== BASIC ROUND FUNCTIONS =====

// Function to get a random basic color
function getRandomBasicColor() {
    let basicColors = ["red", "blue", "yellow"];
    let randomIndex = Math.floor(Math.random() * basicColors.length);
    return basicColors[randomIndex];
}

// Function to show a random basic question
function showRandomQuestion() {
    let color1, color2;
    let attempts = 0;
    
    do {
        color1 = getRandomBasicColor();
        color2 = getRandomBasicColor();
        
        while (color2 === color1) {
            color2 = getRandomBasicColor();
        }
        
        attempts = attempts + 1;
        
        if (attempts > 20) {
            break;
        }
        
    } while (wasQuestionAsked(color1, color2));
    
    addQuestionToAsked(color1, color2);
    currentAnswer = mixTwoColors(color1, color2);
    
    // Display the colors
    let colorBox1 = document.getElementById("color1");
    let colorBox2 = document.getElementById("color2");
    let operation = document.getElementById("colorOperation");
    let questionMark = document.getElementById("questionMark");
    
    // Show both boxes for basic round
    colorBox1.style.display = "block";
    colorBox2.style.display = "block";
    operation.style.display = "inline";
    operation.innerText = "+";
    questionMark.innerText = "?";
    
    colorBox1.style.backgroundColor = color1;
    colorBox2.style.backgroundColor = color2;
    
    // Show color choices
    document.getElementById("colorChoices").style.display = "flex";
    showColorChoices();
}

// Function to create color choice buttons for basic round
function showColorChoices() {
    let choicesDiv = document.getElementById("colorChoices");
    choicesDiv.innerText = "";
    
    let possibleAnswers = ["purple", "orange", "green"];
    let choices = [currentAnswer];
    
    while (choices.length < 3) {
        let randomIndex = Math.floor(Math.random() * possibleAnswers.length);
        let randomColor = possibleAnswers[randomIndex];
        
        let alreadyAdded = false;
        for (let i = 0; i < choices.length; i++) {
            if (choices[i] === randomColor) {
                alreadyAdded = true;
            }
        }
        
        if (alreadyAdded === false) {
            choices.push(randomColor);
        }
    }
    
    shuffleArray(choices);
    
    for (let i = 0; i < choices.length; i++) {
        let button = document.createElement("div");
        button.className = "choice-button";
        button.style.backgroundColor = choices[i];
        button.addEventListener("click", function() {
            checkColorChoice(choices[i]);
        });
        choicesDiv.appendChild(button);
    }
}

// ===== HARD ROUND FUNCTIONS =====

// Function to get a random complex result color
function getRandomComplexResultColor() {
    let randomIndex = Math.floor(Math.random() * complexColorMixingRules.length);
    return complexColorMixingRules[randomIndex].result;
}

// Function to get colors that make a specific result
function getColorsForResult(resultColor) {
    for (let i = 0; i < basicColorMixingRules.length; i++) {
        let rule = basicColorMixingRules[i];
        if (rule.result === resultColor) {
            return { color1: rule.color1, color2: rule.color2 };
        }
    }
    
    for (let i = 0; i < complexColorMixingRules.length; i++) {
        let rule = complexColorMixingRules[i];
        if (rule.result === resultColor) {
            return { color1: rule.color1, color2: rule.color2 };
        }
    }
    
    return null;
}

// Function to show a hard round question
function showHardQuestion() {
    let resultColor = getRandomComplexResultColor();
    let colorPair = getColorsForResult(resultColor);
    
    if (colorPair === null) {
        console.log("Error: No colors found for " + resultColor);
        return;
    }
    
    currentAnswer = colorPair.color1 + "+" + colorPair.color2;
    
    console.log("Hard round: What makes " + resultColor + "? Answer: " + currentAnswer);
    
    // Update display for hard round
    let colorBox1 = document.getElementById("color1");
    let colorBox2 = document.getElementById("color2");
    let operation = document.getElementById("colorOperation");
    let questionMark = document.getElementById("questionMark");
    
    colorBox1.style.backgroundColor = resultColor;
    colorBox1.style.display = "block";
    colorBox2.style.display = "none";
    operation.innerText = "=";
    questionMark.innerText = "? + ?";
    
    // Show hard round color choices
    document.getElementById("colorChoices").style.display = "flex";
    showHardRoundChoices();
}

// Function to show color choices for hard round
function showHardRoundChoices() {
    let choicesDiv = document.getElementById("colorChoices");
    choicesDiv.innerText = ""; // Clear existing choices
    
    // Add instruction text
    let instruction = document.createElement("p");
    instruction.innerText = "Pick TWO colors that make this color!";
    instruction.style.fontSize = "18px";
    instruction.style.fontWeight = "bold";
    choicesDiv.appendChild(instruction);
    
    // Create a container for the color buttons
    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.flexWrap = "wrap";
    choicesDiv.appendChild(buttonContainer);
    
    // All possible colors to choose from
    let allColors = ["red", "blue", "yellow", "white", "black", "orange", "purple", "green"];
    
    // Create a button for each color
    for (let i = 0; i < allColors.length; i++) {
        let button = document.createElement("div");
        button.className = "choice-button";
        button.style.backgroundColor = allColors[i];
        button.id = "color-btn-" + allColors[i]; // Give each button an ID
        
        button.addEventListener("click", function() {
            selectHardRoundColor(allColors[i], button);
        });
        
        buttonContainer.appendChild(button);
    }
    
    // Create a submit button (hidden at first)
    let submitButton = document.createElement("button");
    submitButton.innerText = "Submit Answer";
    submitButton.id = "hardSubmitButton";
    submitButton.style.display = "none";
    submitButton.style.marginTop = "20px";
    submitButton.addEventListener("click", checkHardRoundAnswer);
    choicesDiv.appendChild(submitButton);
}

// ===== UTILITY FUNCTIONS =====

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function createQuestionKey(color1, color2) {
    let sortedColors = [color1, color2].sort();
    return sortedColors[0] + "+" + sortedColors[1];
}

function wasQuestionAsked(color1, color2) {
    let questionKey = createQuestionKey(color1, color2);
    
    for (let i = 0; i < askedQuestions.length; i++) {
        if (askedQuestions[i] === questionKey) {
            return true;
        }
    }
    return false;
}

function addQuestionToAsked(color1, color2) {
    let questionKey = createQuestionKey(color1, color2);
    askedQuestions.push(questionKey);
    console.log("Added question: " + questionKey);
}

function updateProgress() {
    let scoreText = document.getElementById("scoreText");
    scoreText.innerText = "Correct in a row: " + correctInARow + "/3";
}

function updateRoundTitle() {
    let roundTitle = document.getElementById("roundTitle");
    if (currentRound === "basic") {
        roundTitle.innerText = "Basic Round";
    } else {
        roundTitle.innerText = "Hard Round";
    }
}

// ===== GAME FLOW FUNCTIONS =====

function startGame() {
    correctInARow = 0;
    askedQuestions = [];
    currentRound = "basic";
    updateProgress();
    updateRoundTitle();
    
    let startScreen = document.getElementById("startScreen");
    startScreen.style.display = "none";
    
    let gameScreen = document.getElementById("gameScreen");
    gameScreen.style.display = "block";
    
    showRandomQuestion();
}

function checkColorChoice(chosenColor) {
    let feedback = document.getElementById("feedback");
    let isCorrect = checkAnswer(chosenColor, currentAnswer);
    
    if (isCorrect === "true") {
        feedback.innerText = "Correct! Great job!";
        feedback.style.color = "green";
        correctInARow = correctInARow + 1;
        updateProgress();
        
        document.getElementById("colorChoices").style.display = "none";
        showNextButton();
        
    } else {
        feedback.innerText = "Try again! That's not the right color.";
        feedback.style.color = "red";
        correctInARow = 0;
        updateProgress();
    }
}

function showNextButton() {
    let feedback = document.getElementById("feedback");
    let nextButton = document.createElement("button");
    nextButton.innerText = "Next Question";
    nextButton.addEventListener("click", goToNextQuestion);
    feedback.appendChild(nextButton);
}

function goToNextQuestion() {
    let feedback = document.getElementById("feedback");
    feedback.innerText = "";
    
    document.getElementById("colorChoices").style.display = "flex";
    
    if (correctInARow >= 3 && currentRound === "basic") {
        alert("You completed the basic round! Moving to hard round...");
        
        currentRound = "hard";
        correctInARow = 0;
        askedQuestions = [];
        updateProgress();
        updateRoundTitle();
        
        showHardQuestion();
        
    } else {
        if (currentRound === "basic") {
            showRandomQuestion();
        } else {
            showHardQuestion();
        }
    }
}



function checkAnswer(userGuess, correctAnswer) {
    if (userGuess === correctAnswer) {
        return "true";
    } else {
        return "false";
    }
}