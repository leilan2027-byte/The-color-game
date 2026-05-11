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

// ===== GAME VARIABLES =====
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

function getRandomComplexResultColor() {
    let possibleResults = [];
    
    for (let i = 0; i < complexColorMixingRules.length; i++) {
        let result = complexColorMixingRules[i].result;
        
        if (result !== "red" && result !== "blue" && result !== "yellow") {
            possibleResults.push(result);
        }
    }
    
    let randomIndex = Math.floor(Math.random() * possibleResults.length);
    return possibleResults[randomIndex];
}

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

function showHardQuestion() {
    let resultColor = "";
    let color1 = "";
    let color2 = "";
    let attempts = 0;
    
    do {
        resultColor = getRandomComplexResultColor();
        let colorPair = getColorsForResult(resultColor);
        
        if (colorPair === null) {
            console.log("Error: No colors found for " + resultColor);
            continue;
        }
        
        color1 = colorPair.color1;
        color2 = colorPair.color2;
        
        attempts = attempts + 1;
        
        if (attempts > 20) {
            console.log("Too many attempts, using any question");
            break;
        }
        
    } while (wasQuestionAsked(color1, color2));
    
    addQuestionToAsked(color1, color2);
    currentAnswer = createQuestionKey(color1, color2);
    
    console.log("Hard round: What makes " + resultColor + "? Answer: " + currentAnswer);
    
    let colorBox1 = document.getElementById("color1");
    let colorBox2 = document.getElementById("color2");
    let operation = document.getElementById("colorOperation");
    let questionMark = document.getElementById("questionMark");
    
    colorBox1.style.backgroundColor = resultColor;
    colorBox1.style.display = "block";
    colorBox2.style.display = "none";
    operation.innerText = "=";
    questionMark.innerText = "? + ?";
    
    document.getElementById("colorChoices").style.display = "flex";
    showHardRoundChoices();
}

function showHardRoundChoices() {
    let choicesDiv = document.getElementById("colorChoices");
    choicesDiv.innerText = "";
    
    let instruction = document.createElement("p");
    instruction.innerText = "Pick TWO colors that make this color!";
    instruction.style.fontSize = "18px";
    instruction.style.fontWeight = "bold";
    choicesDiv.appendChild(instruction);
    
    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.flexWrap = "wrap";
    choicesDiv.appendChild(buttonContainer);
    
    let allColors = ["red", "blue", "yellow", "white", "black", "orange", "purple", "green"];
    
    for (let i = 0; i < allColors.length; i++) {
        let button = document.createElement("div");
        button.className = "choice-button";
        button.style.backgroundColor = allColors[i];
        button.id = "color-btn-" + allColors[i];
        
        button.addEventListener("click", function() {
            selectHardRoundColor(allColors[i], button);
        });
        
        buttonContainer.appendChild(button);
    }
    
    let submitButton = document.createElement("button");
    submitButton.innerText = "Submit Answer";
    submitButton.id = "hardSubmitButton";
    submitButton.style.display = "none";
    submitButton.style.marginTop = "20px";
    submitButton.addEventListener("click", checkHardRoundAnswer);
    choicesDiv.appendChild(submitButton);
}

function selectHardRoundColor(colorName, buttonElement) {
    let alreadySelected = false;
    let selectedIndex = -1;
    
    for (let i = 0; i < selectedColors.length; i++) {
        if (selectedColors[i] === colorName) {
            alreadySelected = true;
            selectedIndex = i;
        }
    }
    
    if (alreadySelected) {
        selectedColors.splice(selectedIndex, 1);
        buttonElement.style.border = "3px solid #333";
        buttonElement.style.transform = "scale(1)";
    } else {
        if (selectedColors.length < 2) {
            selectedColors.push(colorName);
            buttonElement.style.border = "5px solid gold";
            buttonElement.style.transform = "scale(1.1)";
        } else {
            alert("You can only select 2 colors! Unselect one first.");
            return;
        }
    }
    
    console.log("Selected colors: " + selectedColors);
    
    let submitButton = document.getElementById("hardSubmitButton");
    if (selectedColors.length === 2) {
        submitButton.style.display = "block";
    } else {
        submitButton.style.display = "none";
    }
}

function checkHardRoundAnswer() {
    let feedback = document.getElementById("feedback");
    
    let userAnswer = createQuestionKey(selectedColors[0], selectedColors[1]);
    
    console.log("User answer: " + userAnswer);
    console.log("Correct answer: " + currentAnswer);
    
    if (userAnswer === currentAnswer) {
        feedback.innerText = "Correct! Great job!";
        feedback.style.color = "green";
        correctInARow = correctInARow + 1;
        updateProgress();
        
        document.getElementById("colorChoices").style.display = "none";
        
        selectedColors = [];
        
        showNextButton();
        
    } else {
        feedback.innerText = "Try again! Those colors don't make this color.";
        feedback.style.color = "red";
        correctInARow = 0;
        updateProgress();
        
        selectedColors = [];
        
        let allButtons = document.querySelectorAll(".choice-button");
        for (let i = 0; i < allButtons.length; i++) {
            allButtons[i].style.border = "3px solid #333";
            allButtons[i].style.transform = "scale(1)";
        }
        
        let submitBtn = document.getElementById("hardSubmitButton");
        if (submitBtn) {
            submitBtn.style.display = "none";
        }
    }
}

// ===== GAME FLOW FUNCTIONS =====

function startGame() {
    correctInARow = 0;
    askedQuestions = [];
    currentRound = "basic";
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
        alert("You completed the basic round! Moving to hard round...");
        
        currentRound = "hard";
        correctInARow = 0;
        askedQuestions = [];
        updateProgress();
        updateRoundTitle();
        
        showHardQuestion();
        
    } else if (correctInARow >= 3 && currentRound === "hard") {
        alert("Congratulations! You completed both rounds! Now you know your colors!");
        
        let gameScreen = document.getElementById("gameScreen");
        gameScreen.style.display = "none";
        
        let startScreen = document.getElementById("startScreen");
        startScreen.style.display = "block";
        
    } else {
        if (currentRound === "basic") {
            showRandomQuestion();
        } else {
            showHardQuestion();
        }
    }
}