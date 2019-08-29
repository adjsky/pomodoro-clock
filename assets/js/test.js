const timer = document.querySelector("#time-left"),
    timerName = document.querySelector("#timer-label"),
    control = document.querySelector(".pomodoro__control"),
    configuration = document.querySelector(".pomodoro__configuration");

let sessionLength = 25,
    breakLength = 5,
    timerInterval,
    timeleft,
    breakStarted,
    timerRunning;

function startTimer(time = sessionLength * 60) {
    timeleft = time;
    var interval = 1000; // ms
    var expected = Date.now() + interval;
    timerInterval = setTimeout(function step() {
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
        }
        let minutes = Math.trunc(timeleft / 60);
        let seconds = timeleft - minutes * 60;
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        timer.textContent = minutes + ":" + seconds;
        timeleft -= 1;
        if (breakStarted) {
            timerName.textContent = "Break";
        } else {
            timerName.textContent = "Session";
        }
        if (timeleft < 0) {
            clearTimeout(timerInterval); // delete interval before starting another
            if (breakStarted) {
                breakStarted = false;
                startTimer();
            } else {
                breakStarted = true;
                startTimer(breakLength * 60);
            }
        }
        expected += interval;
        setTimeout(step, Math.max(0, interval - dt)); // take into account drift
    }, interval);
  

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
