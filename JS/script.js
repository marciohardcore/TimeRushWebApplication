
let schedule = [];

function addNewItem(){
    let taskName = document.querySelector("#taskItem").value;
    let taskDuration = document.querySelector("#timeInput").value;
    let task = {
        name:taskName,
        duration: taskDuration
    };

    schedule.push(task);
}

function CountDown(){
    window.location.href = "../HTML/countdown.html";
    for (let i = 0; i < schedule.length; i++) {
        CountDownMachine(schedule[i].duration);
    }
}


// add new item button
const next = document.getElementById("nextButton");
next.addEventListener("click", addNewItem);



// 
const finish = document.getElementById("finishButton");
finish.addEventListener("click", CountDown);

