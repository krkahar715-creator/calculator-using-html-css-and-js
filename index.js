const result = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');
let expression = '';

function updateDisplay(value) {
    result.textContent = value;
}

function sanitizeExpression(value) {
    return value
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100');
}

function isOperator(char) {
    return ['+', '-', '×', '÷', '*', '/'].includes(char);
}

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === 'clear') {
            expression = '';
            updateDisplay('0');
            return;
        }

        if (action === 'delete') {
            expression = expression.slice(0, -1);
            updateDisplay(expression || '0');
            return;
        }

        if (action === 'equals') {
            if (!expression) {
                return;
            }

            try {
                const safeExpression = sanitizeExpression(expression);
                const evaluation = Function(`"use strict"; return (${safeExpression});`)();

                if (!Number.isFinite(evaluation)) {
                    throw new Error('Invalid calculation');
                }

                expression = String(evaluation);
                updateDisplay(expression);
            } catch (error) {
                expression = '';
                updateDisplay('Error');
            }
            return;
        }

        if (value === '%') {
            if (!expression) {
                return;
            }

            try {
                const safeExpression = sanitizeExpression(expression);
                const percentageValue = Function(`"use strict"; return (${safeExpression}) / 100;`)();
                expression = String(percentageValue);
                updateDisplay(expression);
            } catch (error) {
                expression = '';
                updateDisplay('Error');
            }
            return;
        }

        if (value === '.') {
            const lastPart = expression.split(/[+\-×÷/]/).pop();
            if (lastPart.includes('.')) {
                return;
            }
        }

        if (isOperator(value)) {
            const lastChar = expression.slice(-1);

            if (!expression && value !== '-') {
                return;
            }

            if (lastChar && isOperator(lastChar) && value !== '-') {
                expression = expression.slice(0, -1) + value;
                updateDisplay(expression);
                return;
            }

            if (lastChar === '.' || (lastChar && isOperator(lastChar) && value === '-')) {
                expression += value;
                updateDisplay(expression);
                return;
            }

            expression += value;
            updateDisplay(expression);
            return;
        }

        if (result.textContent === 'Error') {
            expression = '';
        }

        expression += value;
        updateDisplay(expression);
    });
});
