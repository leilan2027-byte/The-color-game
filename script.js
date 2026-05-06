console.log("Start Game");

// Get the start button and add an event listener
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

// Game variables
let correctInARow = 0;
let currentAnswer = "";
let askedQuestions = [];

// Function to create color choice buttons
function showColorChoices() {
    let choicesDiv = document.getElementById("colorChoices");
    choicesDiv.innerText = ""; // Clear any existing choices
    
    // List of possible answer colors
    let possibleAnswers = ["purple", "orange", "green", "pink", "grey", "brown"];
    
    // Make sure the correct answer is included
    let choices = [currentAnswer];
    
    // Add random wrong answers until we have 3 total choices
    while (choices.length < 3) {
        let randomIndex = Math.floor(Math.random() * possibleAnswers.length);
        let randomColor = possibleAnswers[randomIndex];
        
        // Only add if not already in choices
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
    
    // Shuffle the choices so correct answer isn't always first
    shuffleArray(choices);
    
    // Create a button for each choice
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

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        // Swap elements
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Function to check the color choice
function checkColorChoice(chosenColor) {
    let feedback = document.getElementById("feedback");
    
    // Check if the answer is correct
    let isCorrect = checkAnswer(chosenColor, currentAnswer);
    
    if (isCorrect === "true") {
        feedback.innerText = "Correct! Great job!";
        feedback.style.color = "green";
        correctInARow = correctInARow + 1;
        updateProgress();
        
        // Hide color choices, show next button
        document.getElementById("colorChoices").style.display = "none";
        showNextButton();
        
    } else {
        feedback.innerText = "Try again! That's not the right color.";
        feedback.style.color = "red";
        // Reset progress on wrong answer
        correctInARow = 0;
        updateProgress();
    }
}

// Game variables - ADD THIS NEW ONE
let currentRound = "basic"; // Track which round we're in

// Function to update the round title
function updateRoundTitle() {
    let roundTitle = document.getElementById("roundTitle");
    if (currentRound === "basic") {
        roundTitle.innerText = "Basic Round";
    } else {
        roundTitle.innerText = "Hard Round";
    }
}

// Function to create a question key for tracking
function createQuestionKey(color1, color2) {
    // Sort colors so "red+blue" and "blue+red" are treated as the same
    let sortedColors = [color1, color2].sort();
    return sortedColors[0] + "+" + sortedColors[1];
}

// Function to check if question was already asked
function wasQuestionAsked(color1, color2) {
    let questionKey = createQuestionKey(color1, color2);
    
    // Check if this question key is in our asked questions list
    for (let i = 0; i < askedQuestions.length; i++) {
        if (askedQuestions[i] === questionKey) {
            return true; // Question was already asked
        }
    }
    return false; // Question is new
}

// Function to add question to asked list
function addQuestionToAsked(color1, color2) {
    let questionKey = createQuestionKey(color1, color2);
    askedQuestions.push(questionKey);
    console.log("Added question: " + questionKey);
    console.log("Total asked questions: " + askedQuestions.length);
}

// Function to update the progress display
function updateProgress() {
    let scoreText = document.getElementById("scoreText");
    scoreText.innerText = "Correct in a row: " + correctInARow + "/3";
}

// Function to get a random basic color
function getRandomBasicColor() {
    let basicColors = ["red", "blue", "yellow"];
    let randomIndex = Math.floor(Math.random() * basicColors.length);
    return basicColors[randomIndex];
}

// Function to mix two colors and return the result
function mixTwoColors(color1, color2) {
    if ((color1 === "red" && color2 === "blue") || (color1 === "blue" && color2 === "red")) {
        return "purple";
    }
    if ((color1 === "red" && color2 === "yellow") || (color1 === "yellow" && color2 === "red")) {
        return "orange";
    }
    if ((color1 === "blue" && color2 === "yellow") || (color1 === "yellow" && color2 === "blue")) {
        return "green";
    }
    return "unknown"; 
}

// Function to start the game
function startGame() {
    // Reset progress and asked questions
    correctInARow = 0;
    askedQuestions = [];
    updateProgress();
    
    // Hide the start screen
    let startScreen = document.getElementById("startScreen");
    startScreen.style.display = "none";
    
    // Show the game screen
    let gameScreen = document.getElementById("gameScreen");
    gameScreen.style.display = "block";
    
    // Show the first random question
    showRandomQuestion();
}

// Function to show a random basic question
function showRandomQuestion() {
    let color1, color2;
    let attempts = 0;
    
    // Keep trying until we find a new question
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
    
    colorBox1.style.backgroundColor = color1;
    colorBox2.style.backgroundColor = color2;
    
    // Show color choices
    document.getElementById("colorChoices").style.display = "flex";
    showColorChoices();
}

// Function to show the next button
function showNextButton() {
    let feedback = document.getElementById("feedback");
    let nextButton = document.createElement("button");
    nextButton.innerText = "Next Question";
    nextButton.addEventListener("click", goToNextQuestion);
    
    // Add the next button after the feedback
    feedback.appendChild(nextButton);
}

// Function to go to the next question
function goToNextQuestion() {
    // Clear feedback area
    let feedback = document.getElementById("feedback");
    feedback.innerText = "";
    
    // Show color choices again
    document.getElementById("colorChoices").style.display = "flex";
    
    // Check if player completed basic round
    if (correctInARow >= 3 && currentRound === "basic") {
        alert("You completed the basic round! Moving to hard round...");
        
        // Switch to hard round
        currentRound = "hard";
        correctInARow = 0; // Reset progress for hard round
        askedQuestions = []; // Clear asked questions
        updateProgress();
        updateRoundTitle();
        
        // Show first hard question
        showHardQuestion();
        
    } else {
        // Show next question based on current round
        if (currentRound === "basic") {
            showRandomQuestion();
        } else {
            showHardQuestion();
        }
    }
}
        // TODO: Add hard round later

function hardRound() {
            // Pick a random result color from our mixing rules
let resultColor = getRandomResultColor();
    
// Find which two colors make this result
let color1 = "";
let color2 = "";
    
if (resultColor === "purple") {
        color1 = "red";
        color2 = "blue";
 }
if (resultColor === "orange") {
    color1 = "red";
    color2 = "yellow";
}
if (resultColor === "green") {
    color1 = "blue";
    color2 = "yellow";
}
    
// Store the answer (we need BOTH colors)
currentAnswer = color1 + "+" + color2;
    
alert("Hard round! What makes " + resultColor + "?"); // Debug
    
// Display the result color
    let colorBox1 = document.getElementById("color1");
    let colorBox2 = document.getElementById("color2");
    
// Show the result color in first box
    colorBox1.style.backgroundColor = resultColor;
    
    // Hide the second box and the + and = signs for now
    colorBox2.style.display = "none";
    document.getElementById("colorOperation").style.display = "none";
    document.getElementById("questionMark").innerText = "= ? + ?";
}

// Function to get a random result color
function getRandomResultColor() {
    let resultColors = ["purple", "orange", "green"];
    let randomIndex = Math.floor(Math.random() * resultColors.length);
    return resultColors[randomIndex];

        }

     


// Function that returns "true" or "false" as strings
function checkAnswer(userGuess, correctAnswer) {
    if (userGuess === correctAnswer) {
        return "true";
    } else {
        return "false";
    }
}