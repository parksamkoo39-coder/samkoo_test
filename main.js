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
