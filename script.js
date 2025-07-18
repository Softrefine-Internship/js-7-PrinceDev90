const quizForm = document.querySelector("#quizForm");
const currentScoreEle = document.getElementById("currentScore");
const currentQuestionEle = document.querySelector("#currentQuestion");
const totalQuestionsEle = document.getElementById("totalQuestions");
const loader_layer = document.querySelector(".loader_layer");
const questionTextEle = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const quitQuizEle = document.querySelector("#quitQuiz");
const nextButtonEle = document.getElementById("nextButton");
const playNewQuizEle = document.getElementById("playNewQuiz");
const screensEle = document.querySelectorAll(".screen");
const correctAnswerEle = document.getElementById("correctAnswer");
const optionEle = document.querySelectorAll(".option");
const correctAnswerTextEle = document.getElementById("correctAnswerText");

quizForm.addEventListener("submit", startQuiz);
quitQuizEle.addEventListener("click", quitQuiz);
nextButtonEle.addEventListener("click", nextQuestion);
playNewQuizEle.addEventListener("click", playNewQuiz);

let currentQuestionIndex = 0;
let totalQuestions = 10;
let currentScore = 0;
let selectedAnswer = null;
let correctAnswer = null;
let fetchedQuestions = [];

function showScreen(screenNumber) {
  screensEle.forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(`screen${screenNumber}`).classList.add("active");
}

function active_loader(status) {
  if (status) {
    loader_layer.classList.add("active");
  } else {
    loader_layer.classList.remove("active");
  }
}

async function startQuiz(e) {
  e.preventDefault();

  const formData = new FormData(quizForm);
  totalQuestions = Number(formData.get("amount"));

  const quizSetting = {
    questionAmount: totalQuestions,
    questionCategory: formData.get("category"),
    questionDifficulty: formData.get("difficulty"),
    questionType: formData.get("type"),
  };

  totalQuestionsEle.textContent = totalQuestions;

  // Reset quiz state
  currentQuestionIndex = 0;
  currentScore = 0;
  currentScoreEle.textContent = currentScore;
  currentQuestionEle.textContent = 1;

  active_loader(true);
  await fetchQuestion(quizSetting);
  loadSampleQuestion();
  active_loader(false);

  showScreen(2);
}

async function fetchQuestion({
  questionAmount,
  questionCategory,
  questionDifficulty,
  questionType,
}) {
  try {
    let API = `https://opentdb.com/api.php?amount=${questionAmount}`;
    // &category=${questionCategory}&difficulty=${questionDifficulty}&type=${questionType}`;
    if (questionCategory !== "any") {
      API += `&category=${questionCategory}`;
    }
    if (questionDifficulty !== "any") {
      API += `&difficulty=${questionDifficulty}`;
    }
    if (questionType !== "any") {
      API += `&type=${questionType}`;
    }

    const question_res = await fetch(API);
    const data = await question_res.json();
    console.log(data);
    if (data.response_code === 0) {
      console.log("Data fetching.");
      fetchedQuestions = data.results;
      console.log(data.results);
    }

    if (data?.results?.length === 0) {
      alert("No more Question available for this setting.");
    }
  } catch (err) {
    console.error("Error fetching questions:", err);
  }
}

function loadSampleQuestion() {
  const questionData =
    fetchedQuestions[currentQuestionIndex % fetchedQuestions.length];
  console.log(questionData);

  questionTextEle.innerHTML = questionData?.question;

  correctAnswer = questionData.correct_answer;

  const options = [
    ...questionData.incorrect_answers,
    questionData.correct_answer,
  ];

  shuffleArray(options);
  optionsContainer.innerHTML = "";

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.onclick = () => selectAnswer(option, button);
    optionsContainer.appendChild(button);
  });

  // Reset UI state
  correctAnswerEle.style.display = "none";
  nextButtonEle.disabled = true;
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

  optionEle.forEach((btn) => {
    btn.style.pointerEvents = "none";
  });

  if (answer === correctAnswer) {
    buttonElement.classList.add("correct");
    currentScore++;
    currentScoreEle.textContent = currentScore;
  } else {
    buttonElement.classList.add("incorrect");

    optionEle.forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct");
      }
    });

    // Show correct answer
    correctAnswerTextEle.textContent = correctAnswer;
    correctAnswerEle.style.display = "block";
  }

  // Enable next button
  nextButtonEle.disabled = false;
}

function nextQuestion(e) {
  e.preventDefault();
  currentQuestionIndex++;

  if (currentQuestionIndex >= totalQuestions) {
    showResults();
  } else {
    currentQuestionEle.textContent = currentQuestionIndex + 1;

    // Re-enable option buttons
    optionEle.forEach((btn) => {
      btn.style.pointerEvents = "auto";
    });

    loadSampleQuestion();
  }
}

function quitQuiz(e) {
  e.preventDefault();
  if (confirm("Are you sure you want to quit the quiz?")) {
    showResults();
  }
}

function showResults() {
  document.getElementById("finalScore").textContent = currentScore;
  document.getElementById(
    "scoreOutOf"
  ).textContent = `${currentScore} out of ${totalQuestions}`;

  showScreen(3);
}

function playNewQuiz(e) {
  e.preventDefault();
  showScreen(1);
  quizForm.reset();
  document.getElementById("numQuestions").value = "10";
}

document.addEventListener("DOMContentLoaded", function () {
  showScreen(1);
});
