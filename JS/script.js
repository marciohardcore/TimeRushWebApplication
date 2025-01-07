
let schedule = [];

function addNewItem(){
    let taskName = document.querySelector("#taskItem").value;
    let taskDuration = document.querySelector("#timeInput").value;
    let task = {
        name:taskName,
        duration: taskDuration
    };

    schedule.push(task);

    document.querySelector("#taskItem").value = '';
    document.querySelector("#timeInput").value = '';
}

function CountDown(){
    window.location.href = "../HTML/countdown.html";
    for (let i = 0; i < schedule.length; i++) {
        CountDownMachine(schedule[0][i]);
    }
}

function CountDownMachine(timeString){
    //parse the string hh:mm to time
    const [hours, minutes] = timeString.split(":").map(Number);
    let totalSeconds = hours * 3600 + minutes * 60;

    // Countdown function
    const interval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            console.log("Countdown finished!");
            return;
        }

        totalSeconds -= 1;

        // Convert totalSeconds back to hh:mm:ss format
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
        const s = (totalSeconds % 60).toString().padStart(2, "0");

        console.log(`${h}:${m}:${s}`);
    }, 1000); // Update every second
}

// add new item button
const next = document.getElementById("nextButton");
next.addEventListener("click", addNewItem);



// 
const finish = document.getElementById("finishButton");
finish.addEventListener("click", CountDown);

