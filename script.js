const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start");

let LOW_HEIGHT, LOW_WIDTH;

async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    
        video.onloadedmetadata = () => {
            LOW_HEIGHT = Math.floor(video.videoHeight/7);
            LOW_WIDTH = Math.floor(video.videoWidth/7);
            requestAnimationFrame(processFrame);
        };
    } catch (error) {
        console.error("Error accessing webcam:", error);
        alert("Could not access camera.");
    }
}

function processFrame() {
    // Off-screen canvas
    let offCanvas = document.createElement("canvas");
    let offCtx = offCanvas.getContext("2d");
    offCanvas.width = LOW_WIDTH;
    offCanvas.height = LOW_HEIGHT;
    offCtx.drawImage(video, 0, 0, LOW_WIDTH, LOW_HEIGHT);

    const imageData = offCtx.getImageData(0, 0, LOW_WIDTH, LOW_HEIGHT);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        let gray = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
    }

    offCtx.putImageData(imageData, 0, 0);

    // Scaling
    if (LOW_WIDTH/LOW_HEIGHT*window.innerHeight < window.innerWidth) {
        canvas.width = Math.floor(LOW_WIDTH/LOW_HEIGHT*window.innerHeight);
        canvas.height = window.innerHeight;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = Math.floor(LOW_HEIGHT/LOW_WIDTH*window.innerWidth);
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);

    requestAnimationFrame(processFrame);
}


window.onload = () => {
    startVideo();
}