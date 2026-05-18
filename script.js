const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let totalSeconds = WORK_TIME;

let timer = null;

let isRunning = false;
let isBreak = false;

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

function formatTime(seconds) {

  const minutes =
    Math.floor(seconds / 60);

  const remain =
    seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
}

function playAlarm() {

  const audio =
    new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );

  audio.play();
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
}

function startTimer() {

  if (isRunning) return;

  isRunning = true;

  timer = setInterval(() => {

    totalSeconds--;

    const elapsed =
      (isBreak ? BREAK_TIME : WORK_TIME)
      - totalSeconds;

    if (elapsed === 10 * 60) {

      notify("10分経過");
    }

    if (
      elapsed === 20 * 60 &&
      !isBreak
    ) {

      notify("20分経過");
    }

    if (totalSeconds <= 0) {

      if (!isBreak) {

        notify(
          "25分経過。休憩してください"
        );

        isBreak = true;
        totalSeconds = BREAK_TIME;

      } else {

        notify(
          "5分休憩終了"
        );

        isBreak = false;
        totalSeconds = WORK_TIME;
      }
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

  updateDisplay();
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

updateDisplay();