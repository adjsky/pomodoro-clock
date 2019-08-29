const timer = document.querySelector("#time-left"),
    timerName = document.querySelector("#timer-label"),
    control = document.querySelector(".pomodoro__control"),
    configuration = document.querySelector(".pomodoro__configuration"),
    beep = document.querySelector("#beep");

let sessionLength = .1,
    breakLength = .1,
    timerInterval,
    timeleft,
    breakStarted,
    timerRunning;


function changeTimer(left) {
    let minutes = Math.trunc(left / 60);
    let seconds = left - minutes * 60;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    timer.textContent = minutes + ":" + seconds;
    if (breakStarted) {
        timerName.textContent = "Break";
    } else {
        timerName.textContent = "Session";
    }
}


function startTimer(time = sessionLength * 60) {
    timeleft = time;
    timerInterval = setTimeout(function timeout() {
        timeleft -= 1;
        if (timeleft === 0 && !breakStarted) {
            beep.play();
        }
        if (timeleft < 0) {
            if (breakStarted) {
                breakStarted = false;
                startTimer();
                changeTimer(timeleft);
                return;
            } else {
                breakStarted = true;
                startTimer(breakLength * 60);
                changeTimer(timeleft);
                return;
            }
        }
        changeTimer(timeleft);
        timerInterval = setTimeout(timeout, 1000);
    }, 1000);
}

function updateSession() {
    document.querySelector("#session-length").textContent = sessionLength;
    document.querySelector("#break-length").textContent = breakLength;
    timer.textContent =
        `${sessionLength < 10 ? "0" + sessionLength : sessionLength}` +
        ":" +
        "00";
}

updateSession();

control.addEventListener("click", e => {
    const id = e.target.id;
    if (id === "start_stop" || e.target.closest("#start_stop")) {
        if (timerInterval) {
            timerRunning = false;
            clearTimeout(timerInterval);
            timerInterval = null; // check if a clock has been reseted
        } else {
            timerRunning = true;
            timeleft ? startTimer(timeleft) : startTimer(); // start clock after stopping or start after resetting
        }
        return;
    }
    if (id === "reset" || e.target.closest("#reset")) {
        beep.currentTime = 0;
        beep.pause();
        timerRunning = false;
        sessionLength = 25;
        breakLength = 5;
        clearTimeout(timerInterval);
        timerInterval = null;
        timeleft = null;
        timerName.textContent = "Session";
        updateSession();
        return;
    }
});

configuration.addEventListener("click", e => {
    if (timerRunning) return;
    const id = e.target.id;
    if (id === "break-decrement") {
        if (breakLength === 1) return;
        breakLength -= 1;
        updateSession();
        return;
    }
    if (id === "break-increment") {
        if (breakLength === 60) return;
        breakLength += 1;
        updateSession();
        return;
    }
    if (id === "session-decrement") {
        if (sessionLength === 1) return;
        sessionLength -= 1;
        updateSession();
        return;
    }
    if (id === "session-increment") {
        if (sessionLength === 60) return;
        sessionLength += 1;
        updateSession();
        return;
    }
});
