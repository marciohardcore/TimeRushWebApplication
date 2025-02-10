chrome.action.onClicked.addListener(async () => {
    chrome.scripting.executeScript({
        target: { allFrames: true },
        func: openPiPWindow
    });
});

async function openPiPWindow() {
    if (!documentPictureInPicture) {
        alert("Your browser does not support PiP API.");
        return;
    }

    const pipWindow = await documentPictureInPicture.requestWindow({
        width: 250,
        height: 100
    });

    const timerElement = document.createElement("h1");
    timerElement.id = "pip-timer";
    pipWindow.document.body.appendChild(timerElement);

    let timeLeft = 300; // 5 minutes

    function updateTimer() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft > 0) timeLeft--;
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}
