const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clickSound = document.getElementById('click-sound');
const body = document.body;

let currentInput = '0';
let previousInput = '';
let operation = null;
let memory = 0;

// Array of Liverpool FC-related background images (replace with your actual paths)
const backgroundImages = [
    'images/anfieldhug_1920x1080.jpg', // Base size: 1920x1080 (or higher for high-DPI)
    'images/anfieldnight_1920x1080.jpg',
    'images/anfieldstd_1920x1080.jpg.jpg',
    'images/anfieldwin_1920x1080.jpg'
    'images/liverpoolcup_1920x1080.jpg'
];

let currentImageIndex = 0;
let preloadedImages = [];

// Preload images to improve performance
function preloadImages() {
    backgroundImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => preloadedImages.push(img); // Store preloaded images
        img.onerror = () => console.error(`Failed to load image: ${src}`); // Handle errors
    });
}

// Function to change background image using preloaded images
function changeBackground() {
    if (preloadedImages.length === backgroundImages.length) {
        body.style.backgroundImage = `url('${preloadedImages[currentImageIndex].src}')`;
        currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    } else {
        // Fallback if images aren't fully preloaded yet
        body.style.backgroundImage = `url('${backgroundImages[currentImageIndex]}')`;
        currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    }
}

// Start preloading images immediately when the page loads
window.addEventListener('load', () => {
    preloadImages();
    // Start the slideshow (change every 60 seconds) after preloading
    setInterval(changeBackground, 60000); // 60000 ms = 1 minute
    // Initial background set
    changeBackground();
});

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        const action = button.dataset.action;
        const value = button.dataset.value;

        // Play sound with vibration feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50); // Vibrate for 50ms on mobile devices
        }

        // Play sound
        clickSound.currentTime = 0;
        clickSound.play().catch(() => console.log('Sound unavailable'));

        if (value && !action) {
            handleNumber(value);
        } else if (action) {
            handleAction(action);
        }

        updateDisplay();
    });

    // Add touch events for better mobile interaction
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        button.classList.add('touch-active');
    });

    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        button.classList.remove('touch-active');
    });
});

function handleNumber(value) {
    if (currentInput === '0' || currentInput === 'You\'ll Never Walk Alone') {
        currentInput = value;
    } else {
        currentInput += value;
    }

    // Easter egg: Enter "1892" (LFC founding year) to trigger quote
    if (currentInput === '1892') {
        currentInput = 'You\'ll Never Walk Alone';
        display.classList.add('easter-egg');
        setTimeout(() => {
            currentInput = '0';
            display.classList.remove('easter-egg');
            updateDisplay();
        }, 4000);
    }
}

function handleAction(action) {
    switch (action) {
        case 'clear':
            currentInput = '0';
            previousInput = '';
            operation = null;
            break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            if (previousInput && operation) calculate();
            previousInput = currentInput;
            currentInput = '0';
            operation = action;
            break;
        case 'equals':
            if (previousInput && operation) calculate();
            operation = null;
            break;
        case 'percent':
            currentInput = (parseFloat(currentInput) / 100).toString();
            break;
        case 'memory-clear':
            memory = 0;
            break;
        case 'memory-recall':
            currentInput = memory.toString();
            break;
        case 'memory-add':
            memory += parseFloat(currentInput || 0);
            break;
        case 'memory-subtract':
            memory -= parseFloat(currentInput || 0);
            break;
    }
}

function calculate() {
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    switch (operation) {
        case 'add':
            currentInput = (prev + curr).toString();
            break;
        case 'subtract':
            currentInput = (prev - curr).toString();
            break;
        case 'multiply':
            currentInput = (prev * curr).toString();
            break;
        case 'divide':
            currentInput = curr !== 0 ? (prev / curr).toString() : 'Error';
            break;
    }
    previousInput = '';
}

function updateDisplay() {
    display.textContent = currentInput;
}
