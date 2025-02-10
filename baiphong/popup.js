document.addEventListener("DOMContentLoaded", () => {
    const dragBar = document.getElementById("drag-bar");
    let isDragging = false;
    let offsetX, offsetY;

    dragBar.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - document.body.getBoundingClientRect().left;
        offsetY = e.clientY - document.body.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            window.moveTo(e.screenX - offsetX, e.screenY - offsetY);
        }
    });
    document.getElementById("set-timer").addEventListener("click", () => {
        let minutes = parseInt(document.getElementById("custom-time").value);
        if (minutes > 0) {
            chrome.storage.local.set({ countdown: minutes * 60 });
        }
    });
    
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
});

