const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let totalSeconds = WORK_TIME;

let timer = null;

let isRunning = false;
let isBreak = false;

let completedPomodoros =
  Number(localStorage.getItem("count")) || 0;

let totalStudyMinutes =
  Number(localStorage.getItem("study")) || 0;

let currentSet = 0;
let targetSets = 1;

const alarmSound =
  "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg";

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

const countEl =
  document.getElementById("count");

const studyEl =
  document.getElementById("studyTime");

const taskInput =
  document.getElementById("taskInput");

const currentTask =
  document.getElementById("currentTask");

const themeBtn =
  document.getElementById("themeBtn");

const setInput =
  document.getElementById("setInput");

let notified10 = false;
let notified20 = false;

function formatTime(seconds) {

  const minutes =
    Math.floor(seconds / 60);

  const remain =
    seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
}

function playAlarm() {

  const audio =
    new Audio(alarmSound);

  audio.play();

  if (navigator.vibrate) {

    navigator.vibrate(500);
  }
}

function notify(message) {

  playAlarm();

  if (Notification.permission === "granted") {

    new Notification(message);
  }

  alert(message);
}

function updateDisplay() {

  timerEl.textContent =
    formatTime(totalSeconds);

  modeEl.textContent =
    isBreak ? "休憩中" : "作業中";

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

function resetNotifications() {

  notified10 = false;
  notified20 = false;
}

function startTimer() {

  if (isRunning) return;

  targetSets =
    Number(setInput.value) || 1;

  isRunning = true;

  timer = setInterval(() => {

    const totalPhase =
      isBreak ? BREAK_TIME : WORK_TIME;

    const elapsed =
      totalPhase - totalSeconds;

    if (
      elapsed >= 10 * 60 &&
      !notified10
    ) {

      notified10 = true;

      notify("10分経過");
    }

    if (
      elapsed >= 20 * 60 &&
      !notified20 &&
      !isBreak
    ) {

      notified20 = true;

      notify("20分経過");
    }

    totalSeconds--;

    if (totalSeconds < 0) {

      if (!isBreak) {

        notify(
          "25分経過。休憩してください"
        );

        completedPomodoros++;

        currentSet++;

        totalStudyMinutes += 25;

        saveData();

        if (currentSet >= targetSets) {

          notify(
            `${targetSets}セット完了`
          );

          resetTimer();

          return;
        }

        isBreak = true;

        totalSeconds = BREAK_TIME;

      } else {

        notify(
          "5分休憩終了"
        );

        isBreak = false;

        totalSeconds = WORK_TIME;
      }

      resetNotifications();
    }

    updateDisplay();

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

  totalSeconds = WORK_TIME;

  currentSet = 0;

  resetNotifications();

  updateDisplay();
}

function toggleTheme() {

  document.body.classList.toggle(
    "light"
  );
}

startBtn.addEventListener(
  "click",
  async () => {

    if (
      Notification.permission !==
      "granted"
    ) {

      await Notification.requestPermission();
    }

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

updateDisplay();