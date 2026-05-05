console.log("Start Game");

// Get the start button and add an event listener
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

// Get the submit button and add an event listener
let submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", checkUserAnswer);


// Game variables
let correctInARow = 0;
let currentAnswer = "";
let askedQuestions = [];

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
    let basicColors = ["red", "blue", "yellow", "white", "black"]; // Added white and black
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
    if ((color1 === "white" && color2 === "black") || (color1 === "black" && color2 === "white")) {
        return "grey";
    }
    return "unknown"; 
}

// Function to start the game
function startGame() {
    // Reset progress
    correctInARow = 0;
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

// Show the first random question
    showRandomQuestion();


// Function to show a random basic question
function showRandomQuestion() {
    let color1, color2;
    let attempts = 0;
    
    // Keep trying until we find a new question (with safety limit)
    do {
        color1 = getRandomBasicColor();
        color2 = getRandomBasicColor();
        
        // Make sure they're different colors
        while (color2 === color1) {
            color2 = getRandomBasicColor();
        }
        
        attempts = attempts + 1;
        
        // Safety check - if we've tried 20 times, just use any question
        if (attempts > 20) {
            console.log("Too many attempts, using any question");
            break;
        }
        
    } while (wasQuestionAsked(color1, color2));
    
    // Add this question to our asked list
    addQuestionToAsked(color1, color2);


    
    // Set the current answer
    currentAnswer = mixTwoColors(color1, color2);


    
    // Display the colors
    let colorBox1 = document.getElementById("color1");
    let colorBox2 = document.getElementById("color2");
    
    colorBox1.style.backgroundColor = color1;
    colorBox2.style.backgroundColor = color2;
    
    // Hide submit button and show input (in case they were hidden)
    document.getElementById("submitButton").style.display = "block";
    document.getElementById("userAnswer").style.display = "block";
}

// Function to check the user's answer
function checkUserAnswer() {
    // Get the user's guess
    let userInput = document.getElementById("userAnswer");
    let userGuess = userInput.value;
    
    // Get the feedback area
    let feedback = document.getElementById("feedback");
    
    // Check if the answer is correct
    let isCorrect = checkAnswer(userGuess, currentAnswer);
    
    if (isCorrect === "true") {
        feedback.innerText = "Correct! Great job!";
        feedback.style.color = "green";
        correctInARow = correctInARow + 1;
        updateProgress();
        
        // Hide submit button and input, show next button
        document.getElementById("submitButton").style.display = "none";
        document.getElementById("userAnswer").style.display = "none";
        showNextButton();
        
    } else {
        feedback.innerText = "Try again!";
        feedback.style.color = "red";
        // Reset progress on wrong answer
        correctInARow = 0;
        updateProgress();
    }
    
    // Clear the input field
    userInput.value = "";
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
    alert("Next button clicked!"); // Debug alert
    
    // Clear feedback area
    let feedback = document.getElementById("feedback");
    feedback.innerText = "";
    
    // Show submit button and input again
    document.getElementById("submitButton").style.display = "block";
    document.getElementById("userAnswer").style.display = "block";
    
    // Check if player completed basic round
    if (correctInARow >= 3) {
        alert("You completed the basic round! Moving to hard round...");
        // TODO: Add hard round later
    } else {
        alert("Showing new random question..."); // Debug alert
        // Show next random question
        showRandomQuestion();
    }
  }


// Function that returns "true" or "false" as strings
function checkAnswer(userGuess, correctAnswer) {
    if (userGuess === correctAnswer) {
        return "true";
    } else {
        return "false";
    }
}