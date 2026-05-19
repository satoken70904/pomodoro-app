const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timer = null;

let isRunning = false;
let isBreak = false;

let currentSet = 0;

let targetSets = 1;

let notified10 = false;
let notified20 = false;

let endTime =
  Number(localStorage.getItem("endTime")) || 0;

const alarmSound =
  "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg";

const alarmAudio =
  new Audio(alarmSound);

alarmAudio.preload = "auto";

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

function formatTime(seconds) {

  const minutes =
    Math.floor(seconds / 60);

  const remain =
    seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
}

function playAlarm() {

  alarmAudio.pause();

  alarmAudio.currentTime = 0;

  alarmAudio.play()
    .catch(() => {});

  if (navigator.vibrate) {

    navigator.vibrate(500);
  }
}

function notify() {

  playAlarm();
}

function updateDisplay(secondsLeft) {

  timerEl.textContent =
    formatTime(secondsLeft);

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

  localStorage.setItem(
    "endTime",
    endTime
  );
}

function resetNotifications() {

  notified10 = false;

  notified20 = false;
}

function getRemainingSeconds() {

  return Math.max(
    0,
    Math.floor(
      (endTime - Date.now()) / 1000
    )
  );
}

function startPhase(duration) {

  endTime =
    Date.now() + duration * 1000;

  saveData();

  clearInterval(timer);

  timer = setInterval(() => {

    const remaining =
      getRemainingSeconds();

    const elapsed =
      duration - remaining;

    if (
      elapsed >= 10 * 60 &&
      !notified10
    ) {

      notified10 = true;

      notify();
    }

    if (
      elapsed >= 20 * 60 &&
      !notified20 &&
      !isBreak
    ) {

      notified20 = true;

      notify();
    }

    updateDisplay(remaining);

    if (remaining <= 0) {

      clearInterval(timer);

      notify();

      if (!isBreak) {

        completedPomodoros++;

        currentSet++;

        totalStudyMinutes += 25;

        saveData();

        if (
          currentSet >= targetSets
        ) {

          notify();

          resetTimer();

          return;
        }

        isBreak = true;

        resetNotifications();

        startPhase(BREAK_TIME);

      } else {

        isBreak = false;

        resetNotifications();

        startPhase(WORK_TIME);
      }
    }

  }, 1000);
}

function startTimer() {

  if (isRunning) return;

  targetSets =
    Number(setInput.value) || 1;

  isRunning = true;

  startPhase(
    isBreak
    ? BREAK_TIME
    : WORK_TIME
  );
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

  endTime = 0;

  resetNotifications();

  localStorage.removeItem(
    "endTime"
  );

  updateDisplay(WORK_TIME);
}

function toggleTheme() {

  document.body.classList.toggle(
    "light"
  );
}

startBtn.addEventListener(
  "click",
  () => {

    startTimer();
  }
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

updateDisplay(WORK_TIME);