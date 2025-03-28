var taskList = JSON.parse(localStorage.getItem('taskList') || '[]').map(task => ({
    progress: null,
    content: { task: task.task, time: task.time }
}));


var currentTask;
var totalTime, timeLeft, interval, totalTask = taskList.length;

window.onload = function() {
    let theme = localStorage.getItem("theme-name");

    let link = document.getElementById("theme-style");

    if (link && theme == 'day_theme') {
        link.setAttribute("href", `../CSS/style_day_theme.css`);

        if (!document.getElementById("myVideo")) {
            let video = document.createElement("video");
            video.setAttribute("autoplay", "true");
            video.setAttribute("muted", "true");
            video.setAttribute("loop", "true");
            video.setAttribute("id", "myVideo");

            let source = document.createElement("source");
            source.setAttribute("src", "../theme/daytheme.mov");
            source.setAttribute("type", "video/mp4");

            video.appendChild(source);
            document.body.prepend(video); // Adds the video in the background

            video.playbackRate = 0.75; // Adjust this value (0.5 = half speed)
            // video.onloadedmetadata = () => smoothPlaybackSpeed(video, 1.0, 0.5, 2000); // Gradually slow to 0.5 over 2s

        }

    }

};


document.addEventListener("DOMContentLoaded", function () {
    if (taskList.length > 0) {

        let itemCount = taskList.length; // Counting the number of items
        document.getElementById("taskList_Index").style.height = (itemCount * 70) + "px"; // Setting dynamic height
        document.getElementById("finishedTasks").style.height = (itemCount * 70) + "px"; // Setting dynamic height
        
        document.getElementById("taskList_Index").innerHTML = printTaskList();
        document.getElementById("taskList").textContent = taskList[0].content.task;

        let [hr,min,sec] = taskList[0].content.time.split(":");

        document.getElementById("hr").textContent = hr;
        document.getElementById("min").textContent = min;
        document.getElementById("sec").textContent = sec;
    }

    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", startCountdown);
    }

    const openPIP = document.getElementById("popup");
    if (openPIP) {
        openPIP.addEventListener("click", openPiP);
    }

    const nextTaskButton = document.getElementById("nextTask");
    if (nextTaskButton){
        nextTaskButton.addEventListener("click", nextTask);
    }

    const skipTaskButton = document.getElementById("skipTask");
    if (skipTaskButton){
        skipTaskButton.addEventListener("click", skipTask);
    }

    const toPage3 = document.getElementById("surrender");
    if (toPage3){
        toPage3.addEventListener("click", navPage3);
    }
});

function skipTask() {
    showProgressModal().then((percent) => {
        //check
        if (taskList.length === 0) return;

        //effect - interaction (CEI)
        let skippedTask = taskList.shift(); // Remove first task
        skippedTask.progress = percent; // Assign progress percentage
        taskList.push(skippedTask); // Add to the end of the list

        localStorage.setItem('taskList', JSON.stringify(taskList)); // Save changes
        document.getElementById("taskList_Index").innerHTML = printTaskList();

        // Update UI for the new first task
        if (taskList.length > 0) {
            document.getElementById("taskList").textContent = taskList[0].content.task;
            let [hr, min, sec] = taskList[0].content.time.split(":");
            document.getElementById("hr").textContent = hr;
            document.getElementById("min").textContent = min;
            document.getElementById("sec").textContent = sec;
            startCountdown(); // Restart timer for next task
        } else {
            document.getElementById("taskList").textContent = "All tasks completed!";
            document.getElementById("hr").textContent = "00";
            document.getElementById("min").textContent = "00";
            document.getElementById("sec").textContent = "00";
            clearInterval(interval);
        }
    }).catch((error) => {
        console.error("Error while skipping task:", error);
    });
}


function showProgressModal() {
    return new Promise((resolve, reject) => {
        // Freeze the timer
        if (interval) clearInterval(interval);

        // Create a modal popup asking for completion percentage
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.padding = '20px';
        modal.style.borderRadius = '8px';
        modal.style.color = '#fff';
        modal.style.fontSize = '16px';
        modal.style.textAlign = 'center';

        // Add a message to the modal
        const message = document.createElement('p');
        message.textContent = 'How much of the task is completed?';
        modal.appendChild(message);

        // Create a progress bar (slider)
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = 0;
        slider.style.width = '80%';
        slider.style.marginBottom = '15px';
        modal.appendChild(slider);

        // Add a percentage label
        const percentageLabel = document.createElement('span');
        percentageLabel.textContent = `0%`;
        modal.appendChild(percentageLabel);

        // Update the label when the slider is changed
        slider.addEventListener('input', function() {
            percentageLabel.textContent = `${slider.value}%`;
        });

        // Create a button to submit the progress
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.style.padding = '10px 20px';
        submitButton.style.fontSize = '16px';
        submitButton.style.cursor = 'pointer';
        modal.appendChild(submitButton);

        // When the user clicks submit, handle the progress and close the modal
        submitButton.addEventListener('click', function() {
            const completionPercentage = slider.value;
            resolve(completionPercentage); // Resolve the promise with the percentage
            document.body.removeChild(modal); // Close the modal

            // Resume countdown after the modal is closed
            startCountdown();
        });

        // Add modal to the document body
        document.body.appendChild(modal);
    });
}


function navPage3(){
    let score = (totalTask - taskList.length) / totalTask;
    localStorage.setItem("score", score);
    window.location.href = './page3.html';
}

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

    currentTask = taskList[0].content;
    totalTime = parseTimeToSeconds(currentTask.time);
    timeLeft = totalTime;
    
    resetProgressBar();

    interval = setInterval(() => {
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;

        document.getElementById("hr").textContent = String(hours).padStart(2, '0');
        document.getElementById("min").textContent = String(minutes).padStart(2, '0');
        document.getElementById("sec").textContent = String(seconds).padStart(2, '0');

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
        progressBar.style.width = '98%';
    }
}

function updateProgressBar() {
    let percentage = (timeLeft / totalTime) * 100;
    let progressBar = document.getElementById("progress-bar");
    if (progressBar) {
        progressBar.style.width = `${percentage - 2}%`;
    }

    document.getElementById("progress-percentage").textContent = percentage;
    
    let progressText = document.getElementById("progress-percentage");
    if (progressText) {
        progressText.textContent = `${Math.round(percentage)}%`;
    }

}


function printTaskList() {
    
    return taskList.map(task => {
        let progressHTML = task.progress != null 
            ? `<div class="progress-row">
                 <div class="progress-circle" style="background: conic-gradient(black 0% ${task.progress}%, rgb(220, 220, 220) ${task.progress}% 100%)"></div>
               </div>` 
            : "";

        let taskHTML = `
        <li class = "general-row">
            ${progressHTML}
            <div class="taskList_Row">     
                <div class="inner-row">
                    <span class="span-align">
                        <div class="task-name">${task.content.task}</div>
                        <div class="task-time">${task.content.time}</div>
                    </span>
                </div>
            </div>
        </li>`;

        return taskHTML;
    }).join('');
}

function askTaskCompletion() {
    const isDone = confirm("Is the task done?");
    if (isDone) {
        moveToFinishContainer();
        taskList.shift(); // Remove the first task
    } else {
        showProgressModal().then((percent) => {
            taskList.push(taskList.shift()); // Move the task to the end
        });
        
    }

    localStorage.setItem('taskList', JSON.stringify(taskList));
    document.getElementById("taskList_Index").innerHTML = printTaskList();

    if (taskList.length > 0) {
        document.getElementById("taskList").textContent = taskList[0].content.task;

        let [hr,min,sec] = taskList[0].content.time.split(":");

        document.getElementById("hr").textContent = hr;
        document.getElementById("min").textContent = min;
        document.getElementById("sec").textContent = sec;

        startCountdown();
    } else {
        alert("All tasks are completed!");
    }
}


function moveToFinishContainer() {
    let finishedTasksContainer = document.getElementById("finishedTasks");
    if (!finishedTasksContainer) return;

    let finishedTaskHTML = `
    <li class="taskList_Row">
        <div class ="inner-row">
            <span class = "span-align">
                <div class = "task-name">${currentTask.task}</div>
                <div class = "task-time">${currentTask.time}</div>
            </span>
        </div>
    </li>
    `;
    finishedTasksContainer.innerHTML += finishedTaskHTML;
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
        taskNameElement.textContent = taskList.length > 0 ? `Current: ${taskList[0].content.task}` : "No Task";
        taskNameElement.style.marginBottom = '5px';
        pipWindow.document.body.appendChild(taskNameElement);

        // Timer display
        const timerElement = document.createElement("div");
        timerElement.textContent = document.getElementById("hr").textContent + ':' + document.getElementById("min").textContent + ':' + document.getElementById("sec").textContent;

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
        upcomingTask.textContent = taskList.length > 1 ? `Next: ${taskList[1].content.task}` : "No upcoming task";
        upcomingTask.style.marginTop = '10px';
        pipWindow.document.body.appendChild(upcomingTask);

        // Function to update the PiP window dynamically
        setInterval(() => {
            // timerElement.textContent = document.getElementById("timeCountDown").textContent;
            timerElement.textContent = document.getElementById("hr").textContent + ':' + document.getElementById("min").textContent + ':' + document.getElementById("sec").textContent;

            let mainProgressBar = document.getElementById("progress-bar");
            if (mainProgressBar) {
                progressBar.style.width = mainProgressBar.style.width;
            }

            // Update current and upcoming task dynamically
            taskNameElement.textContent = taskList.length > 0 ? `Current: ${taskList[0].content.task}` : "No Task";
            upcomingTask.textContent = taskList.length > 1 ? `Next: ${taskList[1].content.task}` : "No upcoming task";

        }, 500);

        var nextButton = document.createElement("button");
        nextButton.textContent = "Next task";
        nextButton.addEventListener("click", nextTask);
        pipWindow.document.body.appendChild(nextButton);


    } catch (error) {
        console.error('Failed to open PiP window:', error);
    }
}


function nextTask(){
    if (taskList.length === 0) {
        alert("No more tasks!");
        return;
    }

    moveToFinishContainer(); // Move the completed task
    taskList.shift(); // Remove the first task

    localStorage.setItem('taskList', JSON.stringify(taskList));
    document.getElementById("taskList_Index").innerHTML = printTaskList();

    if (taskList.length > 0) {
        document.getElementById("taskList").textContent = taskList[0].content.task;

        let [hr,min,sec] = taskList[0].content.time.split(":");

        document.getElementById("hr").textContent = hr;
        document.getElementById("min").textContent = min;
        document.getElementById("sec").textContent = sec;
        startCountdown(); // Restart timer for the next task
    } else {
        document.getElementById("taskList").textContent = "All tasks completed!";

        document.getElementById("hr").textContent = '00';
        document.getElementById("min").textContent = '00';
        document.getElementById("sec").textContent = '00';
        clearInterval(interval);
    }        
}
