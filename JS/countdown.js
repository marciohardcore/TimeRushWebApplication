var taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
var currentTask;
var totalTime, timeLeft, interval;

document.addEventListener("DOMContentLoaded", function () {
    if (taskList.length > 0) {
        document.getElementById("taskList_Index").innerHTML = printTaskList();
        document.getElementById("taskList").textContent = taskList[0].task;
        document.getElementById("timeCountDown").textContent = taskList[0].time;
    }

    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", startCountdown);
    }

    const openPIP = document.getElementById("popup");
    if (openPIP) {
        openPIP.addEventListener("click", openPiP);
    }
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
    
    resetProgressBar();

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

function resetProgressBar() {
    let progressBar = document.getElementById("progress-bar");
    if (progressBar) {
        progressBar.style.width = '100%';
    }
}

function updateProgressBar() {
    let percentage = (timeLeft / totalTime) * 100;
    let progressBar = document.getElementById("progress-bar");
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
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

function addTaskBackToList() {
    const notiElement = document.getElementById('noti');
    if (notiElement) {
        notiElement.innerHTML = `<p>Task "${currentTask.task}" added back with progress</p>`;
        notiElement.style.visibility = 'visible';

        setTimeout(() => {
            notiElement.style.visibility = 'hidden';
        }, 2000);
    }
}

async function openPiP() {
    if (!('documentPictureInPicture' in window)) {
        alert('documentPictureInPicture API not supported.');
        return;
    }

    try {
        const pipWindow = await documentPictureInPicture.requestWindow({
            width: 300,
            height: 180
        });

        // Style the PiP window
        Object.assign(pipWindow.document.body.style, {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#222',
            color: '#fff',
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            padding: '10px'
        });

        // Current task display
        const taskNameElement = document.createElement("div");
        taskNameElement.textContent = taskList.length > 0 ? `Current: ${taskList[0].task}` : "No Task";
        taskNameElement.style.marginBottom = '5px';
        pipWindow.document.body.appendChild(taskNameElement);

        // Timer display
        const timerElement = document.createElement("div");
        timerElement.textContent = document.getElementById("timeCountDown").textContent;
        timerElement.style.marginBottom = '10px';
        pipWindow.document.body.appendChild(timerElement);

        // Progress bar container
        const progressBarContainer = document.createElement("div");
        Object.assign(progressBarContainer.style, {
            width: '100%',
            height: '10px',
            backgroundColor: '#555',
            borderRadius: '5px',
            overflow: 'hidden'
        });
        pipWindow.document.body.appendChild(progressBarContainer);

        // Progress bar
        const progressBar = document.createElement("div");
        Object.assign(progressBar.style, {
            height: '100%',
            width: '0%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.5s'
        });
        progressBarContainer.appendChild(progressBar);

        // Upcoming task display
        const upcomingTask = document.createElement("div");
        upcomingTask.textContent = taskList.length > 1 ? `Next: ${taskList[1].task}` : "No upcoming task";
        upcomingTask.style.marginTop = '10px';
        pipWindow.document.body.appendChild(upcomingTask);

        // Function to update the PiP window dynamically
        setInterval(() => {
            timerElement.textContent = document.getElementById("timeCountDown").textContent;

            let mainProgressBar = document.getElementById("progress-bar");
            if (mainProgressBar) {
                progressBar.style.width = mainProgressBar.style.width;
            }

            // Update current and upcoming task dynamically
            taskNameElement.textContent = taskList.length > 0 ? `Current: ${taskList[0].task}` : "No Task";
            upcomingTask.textContent = taskList.length > 1 ? `Next: ${taskList[1].task}` : "No upcoming task";

        }, 500);

    } catch (error) {
        console.error('Failed to open PiP window:', error);
    }
}
