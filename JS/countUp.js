let taskList = [];
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');
let savedTime;
let taskNameInput;
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;

startBtn.addEventListener('click', function () {
    timer = true;
    stopWatch();

    taskNameInput = document.getElementById("task-item-name");

});

stopBtn.addEventListener('click', stopItem);

function stopItem() {
    timer = false;
    let savedTime = document.getElementById('hr').innerHTML + ":" + 
                    document.getElementById('min').innerHTML + ":" + 
                    document.getElementById('sec').innerHTML;

    //reset                
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;
    document.getElementById('hr').innerHTML = "00";
    document.getElementById('min').innerHTML = "00";
    document.getElementById('sec').innerHTML = "00";
    // document.getElementById('count').innerHTML = "00";
                


    // Get task list container
    let taskListElement = document.getElementById("taskList_Index");

    // Create list item
    let listItem = document.createElement("li");

    // Create input field
    let inputBar = document.createElement("input");
    inputBar.type = "text";
    inputBar.id = "taskItem";
    inputBar.placeholder = "Enter task name";

    if (taskNameInput != ''){
        inputBar.value = taskNameInput.value;
        document.getElementById("task-item-name").value = '';

    }
    // Create span for saved time
    let timeText = document.createElement("span");
    timeText.textContent = ` - ${savedTime}`;

    // Append input and time to list item using `.append()`
    listItem.append(inputBar, timeText);

    // Append list item to the task list
    taskListElement.append(listItem);
}
resetBtn.addEventListener('click', function () {
    timer = false;
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;
    document.getElementById('hr').innerHTML = "00";
    document.getElementById('min').innerHTML = "00";
    document.getElementById('sec').innerHTML = "00";
    // document.getElementById('count').innerHTML = "00";
});


const openPIP = document.getElementById("pop-up-window");
if (openPIP) {
    openPIP.addEventListener("click", openPiP);
}


let pipWindow;
let pipTaskNameElement;
let pipTimerElement;

async function openPiP() {
    if (!('documentPictureInPicture' in window)) {
        alert('documentPictureInPicture API not supported.');
        return;
    }

    try {
        // Close the existing PiP window if it's already open
        if (pipWindow) {
            pipWindow.close();
        }

        // Request a new PiP window
        pipWindow = await documentPictureInPicture.requestWindow({
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

        // Task name display
        pipTaskNameElement = document.createElement("div");
        pipTaskNameElement.textContent = getTaskName();
        pipTaskNameElement.style.marginBottom = '5px';
        pipWindow.document.body.appendChild(pipTaskNameElement);

        // Timer display
        pipTimerElement = document.createElement("div");
        pipTimerElement.textContent = getTimerValue();
        pipTimerElement.style.marginBottom = '10px';
        pipWindow.document.body.appendChild(pipTimerElement);

        // Function to update PiP dynamically
        setInterval(updatePiP, 10);

        // Stop button in PiP
        let stopButton = document.createElement("button");
        stopButton.textContent = "Stop";
        stopButton.addEventListener("click", stopItem);
        pipWindow.document.body.appendChild(stopButton);

    } catch (error) {
        console.error('Failed to open PiP window:', error);
    }
}

function updatePiP() {
    if (pipWindow) {
        pipTaskNameElement.textContent = `Current: ${getTaskName()}`;
        pipTimerElement.textContent = getTimerValue();
    }
}

// Helper function to get task name
function getTaskName() {
    let taskInput = document.getElementById("task-item-name");
    return taskInput && taskInput.value ? taskInput.value : "Untitled";
}

// Helper function to get timer value
function getTimerValue() {
    return `${document.getElementById('hr').innerHTML}:${document.getElementById('min').innerHTML}:${document.getElementById('sec').innerHTML}`;
}

function stopWatch() {
    if (timer) {
        count++;

        if (count == 100) {
            second++;
            count = 0;
        }

        if (second == 60) {
            minute++;
            second = 0;
        }

        if (minute == 60) {
            hour++;
            minute = 0;
            second = 0;
        }

        let hrString = hour;
        let minString = minute;
        let secString = second;
        let countString = count;

        if (hour < 10) {
            hrString = "0" + hrString;
        }

        if (minute < 10) {
            minString = "0" + minString;
        }

        if (second < 10) {
            secString = "0" + secString;
        }

        if (count < 10) {
            countString = "0" + countString;
        }

        document.getElementById('hr').innerHTML = hrString;
        document.getElementById('min').innerHTML = minString;
        document.getElementById('sec').innerHTML = secString;
        setTimeout(stopWatch, 10);
    }
}
