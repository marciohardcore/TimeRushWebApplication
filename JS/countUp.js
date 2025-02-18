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

    taskNameInput = document.getElementById("pre-enter-task-name");

});

stopBtn.addEventListener('click', function () {
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
        document.getElementById("pre-enter-task-name").value = '';

    }
    // Create span for saved time
    let timeText = document.createElement("span");
    timeText.textContent = ` - ${savedTime}`;

    // Append input and time to list item using `.append()`
    listItem.append(inputBar, timeText);

    // Append list item to the task list
    taskListElement.append(listItem);
});

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
        taskNameElement.textContent = taskNameInput != '' ? `Current: ${taskNameInput.value}` : "Untitled";
        taskNameElement.style.marginBottom = '5px';
        pipWindow.document.body.appendChild(taskNameElement);

        // Timer display
        const timerElement = document.createElement("div");
        timerElement.textContent = `${document.getElementById('hr').innerHTML}:${document.getElementById('min').innerHTML}:${document.getElementById('sec').innerHTML}`;
        timerElement.style.marginBottom = '10px';
        pipWindow.document.body.appendChild(timerElement);

        // Function to update the PiP window dynamically
        setInterval(() => {
            // Update the PiP window timer display using the current values from the main document
            timerElement.textContent = `${document.getElementById('hr').innerHTML}:${document.getElementById('min').innerHTML}:${document.getElementById('sec').innerHTML}`;
        }, 0);

        var stopButton = document.createElement("button");
        stopButton.textContent = "Stop";
        pipWindow.document.body.appendChild(stopButton);

    } catch (error) {
        console.error('Failed to open PiP window:', error);
    }
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
        // document.getElementById('count').innerHTML = countString;
        setTimeout(stopWatch, 10);
    }
}
