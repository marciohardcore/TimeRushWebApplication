var taskList = [];
let draggedItem = null;

document.getElementById("nextButton").addEventListener("click", addNewItem);
document.getElementById("finishButton").addEventListener("click", countDown);
document.getElementById("box3").addEventListener("click", function () {
    alert("Image clicked");
    changeBackground();
});
document.querySelector(".dropbtn").addEventListener("click", myMode);

document.querySelector("#set15").addEventListener("click", () => setTime('00:15'));
document.querySelector("#set30").addEventListener("click", () => setTime('00:30'));
document.querySelector("#set45").addEventListener("click", () => setTime('00:45'));

function printTaskList() {
    let taskHTML = "";
    taskList.forEach((task, index) => {
        taskHTML += `<li class="draggable" draggable="true" data-index="${index}">Task: ${task.task}, Time: ${task.time}</li>`;
    });
    document.getElementById("taskList_Index").innerHTML = taskHTML;
    attachDragEvents();
}

function addNewItem() {
    var taskIndex = document.getElementById("taskItem").value;
    var taskTimeBound = document.getElementById("timeInput").value;

    if (taskIndex && taskTimeBound) {
        taskList.push({ task: taskIndex, time: taskTimeBound });
        printTaskList();
    }
}


function setTime(str){
    document.getElementById("timeInput").value = str;
}
function countDown() {
    localStorage.setItem('taskList', JSON.stringify(taskList));

    const loadingScreen = document.getElementById("loading");
    const video = document.getElementById("loading-video");

    loadingScreen.classList.add("show");
    video.currentTime = 0;
    video.play();

    video.onended = () => {
        window.location.href = './countdown.html';
    };
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
        const textParts = item.textContent.replace("Task: ", "").split(", Time: ");
        return { task: textParts[0], time: textParts[1] };
    });
    console.log("Updated Task List:", taskList);
}

function changeBackground() {
    var imgSrc = document.querySelector('#box3 img').src;
    console.log("Image source:", imgSrc);
    if (imgSrc) {
        document.body.style.backgroundImage = 'url(' + imgSrc + ')';
        document.body.style.backgroundSize = 'cover';
    } else {
        console.log("Image not found or not loaded correctly.");
    }
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
  