var taskList = [];
let draggedItem = null;

document.getElementById("nextButton").addEventListener("click", addNewItem);
document.getElementById("finishButton").addEventListener("click", countDown);

document.querySelector("#set15").addEventListener("click", () => setTime('15:00'));
document.querySelector("#set30").addEventListener("click", () => setTime('30:00'));
document.querySelector("#set45").addEventListener("click", () => setTime('45:00'));

function printTaskList() {
    let taskHTML = "";

    taskList.forEach((task, index) => {
    taskHTML += `
    <li class="draggable taskList_Row" draggable="true" data-index="${index}">
        <div class ="inner-row">
            <span class = "span-align">
                <div class = "task-name">${task.task}</div>
                <div class = "task-time">${task.time}</div>
            </span>
        </div>
    </li>
    `;
    });
    document.getElementById("taskList_Index").innerHTML = taskHTML;
    attachDragEvents();
}

function addNewItem() {
    var taskIndex = document.getElementById("task-item-name").value;
    var taskTimeBound = document.getElementById("hourInput").value + ':' + document.getElementById("minuteInput").value + ':' + document.getElementById("secondInput").value;
    if (taskIndex && taskTimeBound) {
        taskList.push({ task: taskIndex, time: taskTimeBound });
        printTaskList();
    }
}

function setTime(str){
    const myArray = str.split(":");
    document.getElementById("hourInput").value = '00';
    document.getElementById("minuteInput").value = myArray[0];
    document.getElementById("secondInput").value = myArray[1];
}
function countDown() {
    localStorage.setItem('taskList', JSON.stringify(taskList));
    window.location.href = './countdown.html';
}

function attachDragEvents() {
    const items = document.querySelectorAll(".draggable");

    items.forEach(item => {

        item.addEventListener("dragstart", () => {
            draggedItem = item;
            item.classList.add("dragging");
            gsap.to(item, { scale: 1.1, duration: 0.2 });
        });

        item.addEventListener("dragend", () => {
            draggedItem = null;
            item.classList.remove("dragging");
            gsap.to(item, { scale: 1, duration: 0.2 });
            updateListOrder();
        });
    });

    document.getElementById("taskList_Index").addEventListener("dragover", (event) => {
        event.preventDefault();
        const container = event.currentTarget;
        const afterElement = getDragAfterElement(container, event.clientY);
        if (draggedItem && afterElement == null) {
            container.appendChild(draggedItem);
        } else if (draggedItem) {
            container.insertBefore(draggedItem, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


function updateListOrder() {
    taskList = [...document.querySelectorAll(".draggable")].map(item => {
        const index = item.getAttribute("data-index");
        return taskList[index]; // Preserve correct task-time mapping
    }).filter(task => task !== undefined); // Remove any undefined values
    // printTaskList();
}




/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myMode() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
                }
        }
    }
}
  