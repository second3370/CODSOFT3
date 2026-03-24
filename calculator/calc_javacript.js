let screen = document.getElementById('screen');
let historyDiv = document.getElementById('history');
let screenValue = '0';
let memory = 0;
let history = [];

function updateDisplay() {
    screen.value = screenValue === '0' ? '' : screenValue;
}

function addToHistory(expr, result) {
    history.unshift(`${expr} = ${result}`);
    if (history.length > 10) history.pop();
    historyDiv.innerHTML = history.slice(0, 3).map(h => `<div class="hist-item">${h}</div>`).join('');
}

function clearScreen() {
    screenValue = '0';
    updateDisplay();
    history = [];
    historyDiv.innerHTML = '';
}

function deleteLast() {
    screenValue = screenValue === '0' ? '0' : screenValue.slice(0, -1) || '0';
    updateDisplay();
}

function toggleSign() {
    if (screenValue !== '0') {
        screenValue = screenValue.startsWith('-') ? screenValue.slice(1) : '-' + screenValue;
        updateDisplay();
    }
}

function appendToScreen(value) {
    if (screenValue === '0') screenValue = '';
    screenValue += value;
    updateDisplay();
}

function square() {
    let num = parseFloat(screenValue) || 0;
    screenValue = Math.pow(num, 2).toString();
    addToHistory(screenValue + '²', screenValue);
    updateDisplay();
}

function sqrt() {
    let num = parseFloat(screenValue);
    if (num < 0) {
        screen.value = 'Error';
        return;
    }
    screenValue = Math.sqrt(num).toString();
    addToHistory('√' + screenValue, screenValue);
    updateDisplay();
}

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    screenValue = memory.toString();
    updateDisplay();
}

function memoryStore() {
    memory = parseFloat(screenValue) || 0;
}

function memoryPlus() {
    memory += parseFloat(screenValue) || 0;
}

function calculate() {
    try {
        // Simple parser for + - * / % 
        // Handles basic precedence with loops
        let tokens = screenValue.match(/(\d+\.?\d*|\+|-|\/|\*|\%)/g) || [];
        if (tokens.length === 0) return;

        let result = parseFloat(tokens[0]);
        for (let i = 1; i < tokens.length; i += 2) {
            let op = tokens[i];
            let next = parseFloat(tokens[i+1]);
            if (isNaN(next)) break;
            switch (op) {
                case '+':
                    result += next;
                    break;
                case '-':
                    result -= next;
                    break;
                case '*':
                    result *= next;
                    break;
                case '/':
                    if (next === 0) {
                        screen.value = 'Error';
                        return;
                    }
                    result /= next;
                    break;
                case '%':
                    result %= next;
                    break;
            }
        }
        screenValue = result.toString();
        addToHistory(screenValue.replace(/([+*-\/%])/g, ' $1 '), screenValue);
        updateDisplay();
    } catch (e) {
        screen.value = 'Error';
        screenValue = '0';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
});

document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (key >= '0' && key <= '9' || key === '.') {
        appendToScreen(key);
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
        appendToScreen(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || (key.toLowerCase() === 'c' && event.ctrlKey)) {
        clearScreen();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});
