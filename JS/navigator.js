let link;

document.getElementById("get-started").addEventListener("click", function() {
    let selectedMode = document.querySelector('input[name="option"]:checked').value;
    let theme = localStorage.getItem('theme-name') || "../CSS/homepage.css";

    localStorage.setItem('theme-name', theme);

    // Redirect based on selection
    if (selectedMode === "countdown") {
        window.location.href = "../HTML/homepage.html";
    } else if (selectedMode === "pomodoro") {
        window.location.href = "../HTML/pomodoro.html";
    } else if (selectedMode === "countup") {
        window.location.href = "../HTML/countUp.html";

    }
});

document.getElementById("change-theme").addEventListener("click", () =>{
    link = document.getElementById("theme-style");

    localStorage.setItem('theme-name', "");

    if (link.getAttribute("href") === "../CSS/homepage.css"){
        link.setAttribute("href", "../CSS/day_theme.css");
        localStorage.setItem('theme-name', "day_theme");
        // Check if the video already exists to prevent duplicates
        if (!document.getElementById("myVideo")) {
            let video = document.createElement("video");
            video.setAttribute("autoplay", "true");
            video.setAttribute("muted", "true");
            video.setAttribute("loop", "true");
            video.setAttribute("id", "myVideo");

            let source = document.createElement("source");
            source.setAttribute("src", "../theme/daytheme.mov");
            source.setAttribute("type", "video/mp4");

            video.appendChild(source);
            document.body.prepend(video); // Adds the video in the background

            video.playbackRate = 0.75; // Adjust this value (0.5 = half speed)
            // video.onloadedmetadata = () => smoothPlaybackSpeed(video, 1.0, 0.5, 2000); // Gradually slow to 0.5 over 2s

        }
        
    }
    else if (link.getAttribute("href") === "../CSS/day_theme.css"){
        link.setAttribute("href", "../CSS/night_theme.css");
        localStorage.setItem('theme-name', "night_theme");

        let newVideo = document.getElementById("myVideo");
        if (newVideo) newVideo.remove();

    }
    else{
        link.setAttribute("href", "../CSS/homepage.css");
        localStorage.setItem('theme-name', "");

    }
});


