var taskList = JSON.parse(localStorage.getItem('taskList')) || [];
var currentTask;
document.addEventListener("DOMContentLoaded", function () {
    if (taskList.length > 0) {
        document.getElementById("taskList_Index").innerHTML = printTaskList();
        document.getElementById("taskList").textContent = taskList[0].task;
        document.getElementById("timeCountDown").textContent = taskList[0].time;
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

    // Set current task
    currentTask = taskList[0];

    // Parse the task time into seconds
    let timer = parseTimeToSeconds(currentTask.time);

    // Start countdown
    const interval = setInterval(() => {
        let hours = Math.floor(timer / 3600);
        let minutes = Math.floor((timer % 3600) / 60);
        let seconds = timer % 60;

        document.getElementById("timeCountDown").textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timer <= 0) {
            clearInterval(interval);
            askTaskCompletion();
        } else {
            timer--;
        }
    }, 1000);
}

// Function to display tasks
function printTaskList(){
    let taskHTML = "";
    for (let i = 0; i < taskList.length; i++) {
        taskHTML += `<li>Task: ${taskList[i].task}, Time: ${taskList[i].time}</li>`;
    }
    return taskHTML;
}

// Function to ask if the task is done when countdown ends
function askTaskCompletion() {
    const isDone = confirm("Is the task done?");
    if (isDone) {
        moveToFinishContainer();
        taskList.splice(0, 1);  // Remove first task from the list

    } else {
        taskList.splice(0, 1);  // Remove first task from the list
        taskList.push(currentTask);
        addTaskBackToList();
    }
    localStorage.setItem('taskList', JSON.stringify(taskList));  // Save updated task list
    document.getElementById("taskList_Index").innerHTML = printTaskList();  // Update the displayed task list
    if (taskList.length > 0) {
        // Check and start countdown for the next task
        document.getElementById("taskList").textContent = taskList[0].task;
        document.getElementById("timeCountDown").textContent = taskList[0].time;
        startCountdown();  // Start countdown for next task
    } else {
        alert("All tasks are completed!");
    }

}

// Move task to finished container
function moveToFinishContainer() {
    document.querySelector('.finish-container').innerHTML += `<li>Task: ${currentTask.task}, Time: ${currentTask.time}</li>`;
}

// Sleep function that returns a promise
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add task back to the list with progress %
function addTaskBackToList() {
    document.getElementById('noti').innerHTML += `<p>Task "${currentTask.task}" added back with progress</p>`;
    
    sleep(2000).then(() => {
        // Hide the notification after 2 seconds
        document.getElementById('noti').style.visibility = 'hidden';
    });
}
