console.log("Start Game");

// Get the start button and add an event listener
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

// ===== COLOR MIXING RULES =====
let basicColorMixingRules = [
    { color1: "red", color2: "blue", result: "purple" },
    { color1: "red", color2: "yellow", result: "orange" },
    { color1: "blue", color2: "yellow", result: "green" }
];

let complexColorMixingRules = [
    { color1: "red", color2: "white", result: "pink" },
    { color1: "blue", color2: "white", result: "lightblue" },
    { color1: "green", color2: "white", result: "lightgreen" },
    { color1: "purple", color2: "white", result: "lavender" },
    { color1: "orange", color2: "white", result: "peachpuff" },
    { color1: "yellow", color2: "white", result: "lightyellow" },
    { color1: "red", color2: "black", result: "maroon" },
    { color1: "blue", color2: "black", result: "navy" },
    { color1: "green", color2: "black", result: "darkgreen" },
    { color1: "purple", color2: "black", result: "indigo" },
    { color1: "orange", color2: "black", result: "brown" },
    { color1: "yellow", color2: "black", result: "olive" },
    { color1: "red", color2: "orange", result: "orangered" },
    { color1: "yellow", color2: "orange", result: "gold" },
    { color1: "yellow", color2: "green", result: "yellowgreen" },
    { color1: "blue", color2: "green", result: "teal" },
    { color1: "blue", color2: "purple", result: "indigo" },
    { color1: "red", color2: "purple", result: "magenta" },
    { color1: "red", color2: "green", result: "brown" },
    { color1: "white", color2: "black", result: "grey" }

];

// ===== GAME VARIABLES =====
let totalComplexColors = 0;

function countUniqueComplexColors() {
    let uniqueColors = [];
    
    for (let i = 0; i < complexColorMixingRules.length; i++) {
        let result = complexColorMixingRules[i].result;
        let alreadyCounted = false;
        
        for (let j = 0; j < uniqueColors.length; j++) {
            if (uniqueColors[j] === result) {
                alreadyCounted = true;
            }
        }
        
        if (alreadyCounted === false) {
            uniqueColors.push(result);
        }
    }
    
    return uniqueColors.length;
}



let correctInARow = 0;
let currentAnswer = "";
let askedQuestions = [];
let currentRound = "basic";
let selectedColors = [];

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
    
    if (currentRound === "basic") {
        scoreText.innerText = "Correct in a row: " + correctInARow + "/3";
    } else {
        scoreText.innerText = "Colors learned: " + correctInARow + "/" + totalComplexColors;
    }
}

function updateRoundTitle() {
    let roundTitle = document.getElementById("roundTitle");
    if (currentRound === "basic") {
        roundTitle.innerText = "Basic Round";
    } else {
        roundTitle.innerText = "Hard Round";
    }
}

function checkAnswer(userGuess, correctAnswer) {
    if (userGuess === correctAnswer) {
        return "true";
    } else {
        return "false";
    }
}

// ===== MIXING FUNCTIONS =====

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

function getRandomBasicColor() {
    let basicColors = ["red", "blue", "yellow"];
    let randomIndex = Math.floor(Math.random() * basicColors.length);
    return basicColors[randomIndex];
}

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
    
    let colorBox1 = document.getElementById("color1");
    let colorBox2 = document.getElementById("color2");
    let operation = document.getElementById("colorOperation");
    let questionMark = document.getElementById("questionMark");
    
    colorBox1.style.display = "block";
    colorBox2.style.display = "block";
    operation.style.display = "inline";
    operation.innerText = "+";
    questionMark.innerText = "?";
    
    colorBox1.style.backgroundColor = color1;
    colorBox2.style.backgroundColor = color2;
    
    document.getElementById("colorChoices").style.display = "flex";
    showColorChoices();
}

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

// ===== HARD ROUND FUNCTIONS =====



function showHardQuestion() {
    let color1 = "";
    let color2 = "";
    let attempts = 0;
    
    // Get all possible colors for hard round
    let availableColors = ["red", "blue", "yellow", "white", "black", "orange", "purple", "green"];
    
    do {
        let validPairFound = false;
        
        let randomIndex1 = Math.floor(Math.random() * availableColors.length);
        color1 = availableColors[randomIndex1];
        
        let randomIndex2 = Math.floor(Math.random() * availableColors.length);
        color2 = availableColors[randomIndex2];
        
        while (color2 === color1) {
            randomIndex2 = Math.floor(Math.random() * availableColors.length);
            color2 = availableColors[randomIndex2];
        }
        
        // Check if this color pair has a valid mixing rule
        let testResult = mixTwoColors(color1, color2);
        if (testResult !== "unknown") {
            validPairFound = true;
        }
        
        attempts = attempts + 1;
        
        if (attempts > 50) {
            console.log("Too many attempts, using any question");
            break;
        }
        
        if (validPairFound === true && wasQuestionAsked(color1, color2) === false) {
            break;
        }
        
    } while (true);
    
    addQuestionToAsked(color1, color2);
    currentAnswer = mixTwoColors(color1, color2);
    
    console.log("Hard round: " + color1 + " + " + color2 + " = " + currentAnswer);
    
    let colorBox1 = document.getElementById("color1");
    let colorBox2 = document.getElementById("color2");
    let operation = document.getElementById("colorOperation");
    let questionMark = document.getElementById("questionMark");
    
    colorBox1.style.display = "block";
    colorBox2.style.display = "block";
    operation.style.display = "inline";
    operation.innerText = "+";
    questionMark.innerText = "?";
    
    colorBox1.style.backgroundColor = color1;
    colorBox2.style.backgroundColor = color2;
    
    document.getElementById("colorChoices").style.display = "flex";
    showHardRoundChoices();
}

function showHardRoundChoices() {
    let choicesDiv = document.getElementById("colorChoices");
    choicesDiv.innerText = "";
    
    // Get all possible result colors from complex rules
    let allPossibleResults = [];
    for (let i = 0; i < complexColorMixingRules.length; i++) {
        let result = complexColorMixingRules[i].result;
        let alreadyAdded = false;
        
        for (let j = 0; j < allPossibleResults.length; j++) {
            if (allPossibleResults[j] === result) {
                alreadyAdded = true;
            }
        }
        
        if (alreadyAdded === false) {
            allPossibleResults.push(result);
        }
    }
    
    // Create choices array with correct answer
    let choices = [currentAnswer];
    
    // Add random wrong answers
    while (choices.length < 4) {
        let randomIndex = Math.floor(Math.random() * allPossibleResults.length);
        let randomColor = allPossibleResults[randomIndex];
        
        let alreadyInChoices = false;
        for (let i = 0; i < choices.length; i++) {
            if (choices[i] === randomColor) {
                alreadyInChoices = true;
            }
        }
        
        if (alreadyInChoices === false) {
            choices.push(randomColor);
        }
    }
    
    shuffleArray(choices);
    
    // Create buttons
    for (let i = 0; i < choices.length; i++) {
        let button = document.createElement("div");
        button.className = "choice-button";
        button.style.backgroundColor = choices[i];
        button.addEventListener("click", function() {
            checkHardRoundAnswer(choices[i]);
        });
        choicesDiv.appendChild(button);
    }
}

function checkHardRoundAnswer(chosenColor) {
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
// ===== GAME FLOW FUNCTIONS =====

function startGame() {
    correctInARow = 0;
    askedQuestions = [];
    currentRound = "basic";
    totalComplexColors = countUniqueComplexColors();
    selectedColors = [];
    updateProgress();
    updateRoundTitle();
    
    let startScreen = document.getElementById("startScreen");
    startScreen.style.display = "none";
    
    let gameScreen = document.getElementById("gameScreen");
    gameScreen.style.display = "block";
    
    showRandomQuestion();
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
    
    selectedColors = [];
    
    document.getElementById("colorChoices").style.display = "flex";
    
 if (correctInARow >= 3 && currentRound === "basic") {
    // Clear the feedback and show transition message
    feedback.innerText = "Great job! Moving to Hard Round...";
    feedback.style.color = "green";
    
    // Hide the color choices during transition
    document.getElementById("colorChoices").style.display = "none";
    
    // Wait a moment then show hard round
    setTimeout(function() {
        feedback.innerText = "";
        
        currentRound = "hard";
        correctInARow = 0;
        askedQuestions = [];
        updateProgress();
        updateRoundTitle();
        
        showHardQuestion();
    }, 2000);
        
    } else if (correctInARow >= totalComplexColors && currentRound === "hard") {
        // Hide game screen
        let gameScreen = document.getElementById("gameScreen");
        gameScreen.style.display = "none";
        
        // Show completion screen
        let completionScreen = document.getElementById("completionScreen");
        completionScreen.style.display = "block";
        
    } else {
        if (currentRound === "basic") {
            showRandomQuestion();
        } else {
            showHardQuestion();
        }
    }
}

let playAgainButton = document.getElementById("playAgainButton");
playAgainButton.addEventListener("click", restartGame);

function restartGame() {
    // Hide completion screen
    let completionScreen = document.getElementById("completionScreen");
    completionScreen.style.display = "none";
    
    // Show start screen
    let startScreen = document.getElementById("startScreen");
    startScreen.style.display = "block";
}