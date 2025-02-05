var taskList = JSON.parse(localStorage.getItem('taskList')) || [];
var currentTask;
var totalTime, timeLeft, interval;

document.addEventListener("DOMContentLoaded", function () {
    if (taskList.length > 0) {
        document.getElementById("taskList_Index").innerHTML = printTaskList();
        document.getElementById("taskList").textContent = taskList[0].task;
        document.getElementById("timeCountDown").textContent = taskList[0].time;
    }

    document.getElementById("startButton").addEventListener("click", startCountdown);
});

function parseTimeToSeconds(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 3600) + (minutes * 60);
}

function startCountdown() {
    if (taskList.length === 0) {
        alert("No tasks available.");
        return;
    }

    if (interval) clearInterval(interval); // Clear existing countdown

    currentTask = taskList[0];
    totalTime = parseTimeToSeconds(currentTask.time);
    timeLeft = totalTime;
    
    updateProgressBar(); // Reset progress bar

    interval = setInterval(() => {
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;

        document.getElementById("timeCountDown").textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        updateProgressBar();

        if (timeLeft <= 0) {
            clearInterval(interval);
            askTaskCompletion();
        } else {
            timeLeft--;
        }
    }, 1000);
}

function updateProgressBar() {
    let percentage = (timeLeft / totalTime) * 100; // Reverse the progress
    document.getElementById("progress-bar").style.width = `${percentage}%`;
}

function printTaskList() {
    return taskList.map(task => `<li>Task: ${task.task}, Time: ${task.time}</li>`).join('');
}

function askTaskCompletion() {
    const isDone = confirm("Is the task done?");
    if (isDone) {
        moveToFinishContainer();
        taskList.shift(); // Remove the first task
    } else {
        taskList.push(taskList.shift()); // Move the task to the end
        addTaskBackToList();
    }

    localStorage.setItem('taskList', JSON.stringify(taskList));
    document.getElementById("taskList_Index").innerHTML = printTaskList();

    if (taskList.length > 0) {
        document.getElementById("taskList").textContent = taskList[0].task;
        document.getElementById("timeCountDown").textContent = taskList[0].time;
        startCountdown();
    } else {
        alert("All tasks are completed!");
    }
}

function moveToFinishContainer() {
    document.querySelector('.finished-tasks ul').innerHTML += `<li>Task: ${currentTask.task}, Time: ${currentTask.time}</li>`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addTaskBackToList() {
    const notiElement = document.getElementById('noti');
    notiElement.innerHTML = `<p>Task "${currentTask.task}" added back with progress</p>`;
    notiElement.style.visibility = 'visible';

    sleep(2000).then(() => {
        notiElement.style.visibility = 'hidden';
    });
}
