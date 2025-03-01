const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clickSound = document.getElementById('click-sound');

let currentInput = '0';
let previousInput = '';
let operation = null;
let memory = 0;

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