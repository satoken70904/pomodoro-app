const WORK_TIME = 25 * 60;

const BREAK_TIME = 5 * 60;

let timer = null;

let isRunning = false;

let isBreak = false;

let currentSet = 0;

let targetSets = 1;

let remainingSeconds = WORK_TIME;

let notified10 = false;

let notified20 = false;

const popSound =
  "https://actions.google.com/sounds/v1/cartoon/pop.ogg";

const woodSound =
  "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg";

const popAudio =
  new Audio(popSound);

const woodAudio =
  new Audio(woodSound);

popAudio.preload = "auto";

woodAudio.preload = "auto";

let completedPomodoros =
  Number(localStorage.getItem("count")) || 0;

let totalStudyMinutes =
  Number(localStorage.getItem("study")) || 0;

const timerEl =
  document.getElementById("timer");

const modeEl =
  document.getElementById("mode");

const startBtn =
  document.getElementById("startBtn");

const stopBtn =
  document.getElementById("stopBtn");

const resetBtn =
  document.getElementById("resetBtn");

const themeBtn =
  document.getElementById("themeBtn");

const countEl =
  document.getElementById("count");

const studyEl =
  document.getElementById("studyTime");

const taskInput =
  document.getElementById("taskInput");

const currentTask =
  document.getElementById("currentTask");

const setInput =
  document.getElementById("setInput");

function playPop() {

  popAudio.pause();

  popAudio.currentTime = 0;

  popAudio.play()
    .catch(() => {});
}

function playWood() {

  woodAudio.pause();

  woodAudio.currentTime = 0;

  woodAudio.play()
    .catch(() => {});
}

function formatTime(seconds) {

  const minutes =
    Math.floor(seconds / 60);

  const remain =
    seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
}

function updateDisplay() {

  timerEl.textContent =
    formatTime(remainingSeconds);

  modeEl.textContent =
    isBreak
      ? "休憩中"
      : "作業中";

  countEl.textContent =
    completedPomodoros;

  studyEl.textContent =
    totalStudyMinutes;

  const task =
    taskInput.value.trim();

  currentTask.textContent =
    task || "タスク未設定";
}

function saveData() {

  localStorage.setItem(
    "count",
    completedPomodoros
  );

  localStorage.setItem(
    "study",
    totalStudyMinutes
  );
}

function startTimer() {

  if (isRunning) return;

  targetSets =
    Number(setInput.value) || 1;

  isRunning = true;

  timer = setInterval(() => {

    remainingSeconds--;

    if (
      !isBreak &&
      remainingSeconds <= 15 * 60 &&
      remainingSeconds >= 15 * 60 - 1 &&
      !notified10
    ) {

      notified10 = true;

      playPop();
    }

    if (
      !isBreak &&
      remainingSeconds <= 5 * 60 &&
      remainingSeconds >= 5 * 60 - 1 &&
      !notified20
    ) {

      notified20 = true;

      playPop();
    }

    updateDisplay();

    if (remainingSeconds <= 0) {

      clearInterval(timer);

      playWood();

      if (!isBreak) {

        completedPomodoros++;

        currentSet++;

        totalStudyMinutes += 25;

        saveData();

        if (
          currentSet >= targetSets
        ) {

          resetTimer();

          return;
        }

        isBreak = true;

        remainingSeconds =
          BREAK_TIME;

      } else {

        isBreak = false;

        remainingSeconds =
          WORK_TIME;
      }

      notified10 = false;

      notified20 = false;

      updateDisplay();

      isRunning = false;

      startTimer();
    }

  }, 1000);
}

function stopTimer() {

  clearInterval(timer);

  isRunning = false;
}

function resetTimer() {

  clearInterval(timer);

  isRunning = false;

  isBreak = false;

  currentSet = 0;

  remainingSeconds =
    WORK_TIME;

  notified10 = false;

  notified20 = false;

  updateDisplay();
}

function toggleTheme() {

  document.body.classList.toggle(
    "light"
  );
}

startBtn.addEventListener(
  "click",
  startTimer
);

stopBtn.addEventListener(
  "click",
  stopTimer
);

resetBtn.addEventListener(
  "click",
  resetTimer
);

themeBtn.addEventListener(
  "click",
  toggleTheme
);

updateDisplay();