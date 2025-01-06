
let schedule = [];

function addNewItem(){
    let taskName = document.querySelector("#taskItem");
    let taskDuration = document.querySelector("#timeInput");
    schedule.push(taskName, taskDuration);
}


function CountDownScene(){
    //parse the string hh:mm to time

    //countdown
}

// add new item button
const next = document.getElementById("nextButton");
next.addEventListener("click", addNewItem);



// 
const finish = document.getElementById("finishButton");
finish.addEventListener("click", CountDownScene);

