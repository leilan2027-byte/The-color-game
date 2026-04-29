console.log("Start Game")
// Get the start button and add an event listener
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

// Game variables
let correctInARow = 0;
let currentAnswer = "";

// Function to start the game
function startGame() {
    // Hide the start screen
    let startScreen = document.getElementById("startScreen");
    startScreen.style.display = "none";
    
    // Show the game screen
    let gameScreen = document.getElementById("gameScreen");
    gameScreen.style.display = "block";
    
    // Show the first question
    showFirstQuestion();
}

// Function to show a basic question
function showFirstQuestion() {
    // Set the colors for the first question
    let color1 = "red";
    let color2 = "blue";
    currentAnswer = "purple";
    
    // Display the colors
    let colorBox1 = document.getElementById("color1");
    let colorBox2 = document.getElementById("color2");
    
    colorBox1.style.backgroundColor = color1;
    colorBox2.style.backgroundColor = color2;
}


// Function to check the user's answer
function checkUserAnswer() {
    // Get the user's guess
    let userInput = document.getElementById("userAnswer");
    let userGuess = userInput.value;
    
    // Get the feedback area
    let feedback = document.getElementById("feedback");
    
    // Check if the answer is correct
    if (userGuess === currentAnswer) {
        feedback.innerText = "Correct! Great job!";
        feedback.style.color = "green";
        correctInARow = correctInARow + 1;
    } else {
        feedback.innerText = "Try again! The answer is " + currentAnswer;
        feedback.style.color = "red";
    }
    
    // Clear the input field
    userInput.value = "";
}
