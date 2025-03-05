document.getElementById("get-started").addEventListener("click", function() {
    let selectedMode = document.querySelector('input[name="mode"]:checked').value;
    
    // Redirect based on selection
    if (selectedMode === "basic") {
        window.location.href = "../HTML/index.html"; // Change to your actual page
    } else if (selectedMode === "pomodoro") {
        window.location.href = "../HTML/pomodoro.html";
    } else if (selectedMode === "countup") {
        window.location.href = "../HTML/countUp.html";
    }
});
