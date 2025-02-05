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

function countDown(){
    localStorage.setItem('taskList', JSON.stringify(taskList));
    window.location.href = './countdown.html';
}

document.getElementById("box3").addEventListener("click", function() {
    alert("Image clicked"); // Log to check if the click is detected
    changeBackground();
});

function changeBackground() {
    var imgSrc = document.querySelector('#box3 img').src; // Get the image source
    console.log("Image source:", imgSrc); // Log the image source to ensure it's correct
    if (imgSrc) {
        document.body.style.backgroundImage = 'url(' + imgSrc + ')'; // Set the background of the body
        document.body.style.backgroundSize = 'cover'; // Optional, to make the background cover the whole page
    } else {
        console.log("Image not found or not loaded correctly.");
    }
}







// Incorrect: addNewItem() — This immediately invokes the function when the script runs.
// Correct: addNewItem — This passes a reference to the function, which will only execute when the button is clicked.
