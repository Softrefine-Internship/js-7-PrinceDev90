// write javascript herez
// Global variables for basic state management
// const api = https://opentdb.com/api.php?amount=3&category=25&difficulty=easy&type=multiple;

const quizForm = document.querySelector("#quizForm");

quizForm.addEventListener("submit", startQuiz);

let currentQuestionIndex = 0;
let totalQuestions = 10;
let currentScore = 0;
let selectedAnswer = null;
let correctAnswer = null;
let fetchedQuestions = [];

function showScreen(screenNumber) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(`screen${screenNumber}`).classList.add("active");
}

function startQuiz(e) {
  e.preventDefault();
  
  const formData = new FormData(quizForm);
  totalQuestions = Number(formData.get("amount"));

  const quizSetting = {
    questionAmount: totalQuestions,
    questionCategory: Number(formData.get("category")),
    questionDifficulty: formData.get("difficulty"),
    questionType: formData.get("type"),
  };

  // Set total questions
  document.getElementById("totalQuestions").textContent = totalQuestions;

  // Reset quiz state
  currentQuestionIndex = 0;
  currentScore = 0;
  document.getElementById("currentScore").textContent = currentScore;
  document.getElementById("currentQuestion").textContent = 1;

  // Here you would normally fetch questions from API
  // For now, just show sample question

  fetchQuestion(quizSetting);
  loadSampleQuestion();

  // Show quiz screen
  showScreen(2);
}

async function fetchQuestion({
  questionAmount,
  questionCategory,
  questionDifficulty,
  questionType,
}) {
  try {
    const API = `https://opentdb.com/api.php?amount=${questionAmount}&category=${questionCategory}&difficulty=${questionDifficulty}&type=${questionType}`;

    const question_res = await fetch(API);
    const data = await question_res.json();

    if (data.response_code === 0) {
      fetchedQuestions = data.results;
      console.log("Data fetching.");
      // loadQuestion(); // Load first question after fetch
    } else {
      alert("Failed to fetch questions. Try different settings.");
    }
  } catch (err) {
    console.error("Error fetching questions:", err);
  }
}

function loadSampleQuestion() {
  // Sample question data (in real app, this would come from API)

  // fetchQuestion();

  // console.log(sampleQuestions2);
  const sampleQuestions = [
    {
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["London", "Berlin", "Madrid"],
    },
    {
      question: "Which planet is known as the Red Planet?",
      correct_answer: "Mars",
      incorrect_answers: ["Venus", "Jupiter", "Saturn"],
    },
    {
      question: "What is 2 + 2?",
      correct_answer: "4",
      incorrect_answers: ["3", "5", "6"],
    },
  ];

  // Use sample question or cycle through them
  const questionData =
    sampleQuestions[currentQuestionIndex % sampleQuestions.length];

  // Set question text
  document.getElementById("questionText").innerHTML = questionData.question;

  // Store correct answer
  correctAnswer = questionData.correct_answer;

  // Create options array and shuffle
  const options = [
    ...questionData.incorrect_answers,
    questionData.correct_answer,
  ];
  shuffleArray(options);

  // Create option buttons
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.onclick = () => selectAnswer(option, button);
    optionsContainer.appendChild(button);
  });

  // Reset UI state
  document.getElementById("correctAnswer").style.display = "none";
  document.getElementById("nextButton").disabled = true;
  selectedAnswer = null;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function selectAnswer(answer, buttonElement) {
  // Prevent multiple selections
  if (selectedAnswer !== null) return;

  selectedAnswer = answer;

  // Disable all option buttons
  document.querySelectorAll(".option").forEach((btn) => {
    btn.style.pointerEvents = "none";
  });

  // Check if answer is correct
  if (answer === correctAnswer) {
    buttonElement.classList.add("correct");
    currentScore++;
    document.getElementById("currentScore").textContent = currentScore;
  } else {
    buttonElement.classList.add("incorrect");

    // Highlight correct answer
    document.querySelectorAll(".option").forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct");
      }
    });

    // Show correct answer
    document.getElementById("correctAnswerText").textContent = correctAnswer;
    document.getElementById("correctAnswer").style.display = "block";
  }

  // Enable next button
  document.getElementById("nextButton").disabled = false;
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= totalQuestions) {
    // Quiz complete
    showResults();
  } else {
    // Load next question
    document.getElementById("currentQuestion").textContent =
      currentQuestionIndex + 1;

    // Re-enable option buttons
    document.querySelectorAll(".option").forEach((btn) => {
      btn.style.pointerEvents = "auto";
    });

    loadSampleQuestion();
  }
}

function quitQuiz() {
  if (confirm("Are you sure you want to quit the quiz?")) {
    showResults();
  }
}

function showResults() {
  // Update final score display
  document.getElementById("finalScore").textContent = currentScore;
  document.getElementById(
    "scoreOutOf"
  ).textContent = `${currentScore} out of ${totalQuestions}`;

  // Show results screen
  showScreen(3);
}

function playNewQuiz() {
  // Reset to first screen
  showScreen(1);

  // Reset form values (optional)
  document.getElementById("quizForm").reset();
  document.getElementById("numQuestions").value = "10";
}

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  showScreen(1);
});
