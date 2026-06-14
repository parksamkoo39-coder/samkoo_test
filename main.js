const generateBtn = document.getElementById('generate');
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Theme Logic
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        htmlElement.removeAttribute('data-theme');
        themeToggle.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }
});

// Lotto Generation Logic
generateBtn.addEventListener('click', () => {
    const numbersContainer = document.getElementById('numbers');
    numbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach((number, index) => {
        setTimeout(() => {
            const ball = document.createElement('div');
            ball.className = 'number';
            ball.textContent = number;
            let colorClass;
            if (number <= 10) {
                colorClass = 'color-1'; // Yellow
            } else if (number <= 20) {
                colorClass = 'color-2'; // Blue
            } else if (number <= 30) {
                colorClass = 'color-3'; // Red
            } else if (number <= 40) {
                colorClass = 'color-4'; // Gray
            } else {
                colorClass = 'color-5'; // Green
            }
            ball.classList.add(colorClass);
            numbersContainer.appendChild(ball);
        }, index * 300);
    });
});

// Animal Face Test Logic
const URL = "https://teachablemachine.withgoogle.com/models/FyFuTzpqO/";
let model, webcam, maxPredictions;
let isWebcamMode = false;
let isWebcamRunning = false;

async function initModel() {
    if (model) return;
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

const uploadArea = document.getElementById('upload-area');
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const uploadLabel = document.getElementById('upload-label');
const resultContainer = document.getElementById('result-container');
const resultLabel = document.getElementById('result-label');
const loading = document.getElementById('loading');

const modeUploadBtn = document.getElementById('mode-upload');
const modeWebcamBtn = document.getElementById('mode-webcam');
const uploadContainer = document.getElementById('upload-container');
const webcamContainer = document.getElementById('webcam-container');
const startWebcamBtn = document.getElementById('start-webcam');
const webcamViewer = document.getElementById('webcam-viewer');

// Mode Switching
modeUploadBtn?.addEventListener('click', () => {
    isWebcamMode = false;
    modeUploadBtn.classList.add('active');
    modeWebcamBtn.classList.remove('active');
    uploadContainer.style.display = 'block';
    webcamContainer.style.display = 'none';
    stopWebcam();
});

modeWebcamBtn?.addEventListener('click', () => {
    isWebcamMode = true;
    modeWebcamBtn.classList.add('active');
    modeUploadBtn.classList.remove('active');
    webcamContainer.style.display = 'block';
    uploadContainer.style.display = 'none';
});

// Webcam Logic
async function initWebcam() {
    await initModel();
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    isWebcamRunning = true;
    startWebcamBtn.style.display = 'none';
    webcamViewer.appendChild(webcam.canvas);
    window.requestAnimationFrame(webcamLoop);
}

async function webcamLoop() {
    if (!isWebcamRunning) return;
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(webcamLoop);
}

function stopWebcam() {
    if (webcam) {
        webcam.stop();
        isWebcamRunning = false;
        startWebcamBtn.style.display = 'inline-block';
        if (webcam.canvas && webcamViewer.contains(webcam.canvas)) {
            webcamViewer.removeChild(webcam.canvas);
        }
        webcam = null;
    }
}

startWebcamBtn?.addEventListener('click', initWebcam);

// Upload Logic
if (uploadArea) {
    uploadArea.onclick = () => imageInput.click();

    imageInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                uploadLabel.style.display = 'none';
                await predict(imagePreview);
            };
            reader.readAsDataURL(file);
        }
    };
}

// Prediction Logic (Handles both Image and Webcam Canvas)
async function predict(inputElement) {
    if (!model) {
        loading.style.display = 'block';
        await initModel();
    }
    
    // Only show "Analyzing..." for static upload mode to avoid flicker in real-time mode
    if (!isWebcamMode) {
        loading.style.display = 'block';
        resultContainer.style.display = 'none';
    }

    const prediction = await model.predict(inputElement);
    
    if (!isWebcamMode) {
        loading.style.display = 'none';
    }
    resultContainer.style.display = 'block';

    let maxProb = 0;
    let bestResult = "";

    prediction.forEach(p => {
        const percent = (p.probability * 100).toFixed(0) + "%";
        if (p.className === "강아지") {
            const dogBar = document.getElementById('dog-bar');
            if (dogBar) dogBar.style.width = percent;
            const dogPercent = document.getElementById('dog-percent');
            if (dogPercent) dogPercent.textContent = `Dog: ${percent}`;
        } else if (p.className === "고양이") {
            const catBar = document.getElementById('cat-bar');
            if (catBar) catBar.style.width = percent;
            const catPercent = document.getElementById('cat-percent');
            if (catPercent) catPercent.textContent = `Cat: ${percent}`;
        }
        
        if (p.probability > maxProb) {
            maxProb = p.probability;
            bestResult = p.className === "강아지" ? "You look like a Dog! 🐶" : "You look like a Cat! 🐱";
        }
    });

    resultLabel.textContent = bestResult;
}
