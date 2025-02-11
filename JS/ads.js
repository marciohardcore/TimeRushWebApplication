document.addEventListener("DOMContentLoaded", function() {
    let res = localStorage.getItem("score");
    let scoreElement = document.querySelector(".scoreRate");

    if (scoreElement) {
        scoreElement.innerHTML = res ? res : "No score available";
    } else {
        console.error("Element with ID 'scoreRate' not found.");
    }
});
