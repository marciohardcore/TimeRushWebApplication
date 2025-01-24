function CountDownMachine(timeString){
    //parse the string hh:mm to time
    const [hours, minutes] = timeString.split(":").map(Number);
    let totalSeconds = hours * 3600 + minutes * 60;

    // Countdown function
    const interval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            console.log("Countdown finished!");
            return;
        }

        totalSeconds -= 1;

        // Convert totalSeconds back to hh:mm:ss format
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
        const s = (totalSeconds % 60).toString().padStart(2, "0");

        console.log(`${h}:${m}:${s}`);
        document.getElementById('timeCountDown').innerText = `${h}:${m}:${s}`;
    }, 1000); // Update every second
}
