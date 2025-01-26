var taskList = [];

function printTaskList(){
    let taskHTML = "";
    for (let i in taskList){
        taskHTML += `<li>Task: ${taskList[i].task}, Time: ${taskList[i].time}</li>`;
    }
    return taskHTML;
}

function addNewItem(){
    var taskIndex = document.getElementById("taskItem").value;
    var taskTimeBound = document.getElementById("timeInput").value;

    taskList.push({task: taskIndex, time: taskTimeBound});
    document.getElementById("taskList_Index").innerHTML = printTaskList();
}

const element = document.getElementById("nextButton");
element.addEventListener("click", addNewItem);

// -----------------------
function countDown(){
    localStorage.setItem('taskList', JSON.stringify(taskList));
    window.location.href = './countdown.html';
}











// Incorrect: addNewItem() — This immediately invokes the function when the script runs.
// Correct: addNewItem — This passes a reference to the function, which will only execute when the button is clicked.
