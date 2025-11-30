// src/main.ts

let memory: number = 0; // Для накопительных операций

const displayElement = document.getElementById('display') as HTMLInputElement;

if (!displayElement) {
    throw new Error('Элемент с id="display" не найден в DOM.');
}


function getLastNumber(expr: string): { number: string; start: number } | null {
    const trimmed = expr.trim();
    if (trimmed === '') return null;


    let i = trimmed.length - 1;
    while (i >= 0 && (/[0-9.]/.test(trimmed[i]))) {
        i--;
    }

    const start = i + 1;
    const numberPart = trimmed.slice(start);
    if (numberPart === '' || numberPart === '-') return null;
    return { number: numberPart, start };
}

function applyUnaryOperation(operation: (n: number) => number | null): void {
    const last = getLastNumber(displayElement.value);
    if (!last) {
        displayElement.value = 'Error';
        return;
    }

    const num = parseFloat(last.number);
    if (isNaN(num)) {
        displayElement.value = 'Error';
        return;
    }

    const result = operation(num);
    if (result === null || isNaN(result) || !isFinite(result)) {
        displayElement.value = 'Error';
        return;
    }

    displayElement.value = displayElement.value.slice(0, last.start) + result.toString();
}

function appendToDisplay(value: string): void {
    let current = displayElement.value;

    if (current === 'Error') {
        displayElement.value = '';
        current = '';
    }

    if (/[0-9]/.test(value)) {
        if (current === '') {
            displayElement.value = value === '0' ? '0' : value;
            return;
        }

        const lastPart = current.split(/[/+*()-]/).pop() || '';

        if (lastPart === '0') {
            if (value === '0') return;
            displayElement.value = current.slice(0, -1) + value;
            return;
        }

        if (/^0\.\d*$/.test(lastPart)) {
            displayElement.value += value;
            return;
        }

        if (/^0\d+$/.test(lastPart)) {
            const base = current.slice(0, current.length - lastPart.length);
            displayElement.value = base + value;
            return;
        }
    }

    displayElement.value += value;
}

function clearDisplay(): void {
    displayElement.value = '';
}

function backspace(): void {
    if (displayElement.value === 'Error') {
        displayElement.value = '';
    } else {
        displayElement.value = displayElement.value.slice(0, -1);
    }
}

function toggleSign(): void {
    const last = getLastNumber(displayElement.value);
    if (!last) return;

    const numStr = last.number;
    const newNumStr = numStr.startsWith('-') ? numStr.slice(1) : '-' + numStr;
    displayElement.value = displayElement.value.slice(0, last.start) + newNumStr;
}

function percentage(): void {
    applyUnaryOperation(n => n / 100);
}

function sqrt(): void {
    applyUnaryOperation(n => n < 0 ? null : Math.sqrt(n));
}

function square(): void {
    applyUnaryOperation(n => n * n);
}

function factorial(): void {
    applyUnaryOperation(n => {
        if (n < 0 || !Number.isInteger(n) || n > 170) return null; // 170! — предел IEEE 754
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    });
}

function addTripleZero(): void {
    appendToDisplay('000');
}

function memoryAdd(): void {
    try {
        const expr = displayElement.value.trim();
        if (expr === '') return;
        const val = eval(expr);
        if (typeof val === 'number' && isFinite(val)) {
            memory += val;
        }
    } catch {
        // Игнорировать ошибки
    }
}

function memorySubtract(): void {
    try {
        const expr = displayElement.value.trim();
        if (expr === '') return;
        const val = eval(expr);
        if (typeof val === 'number' && isFinite(val)) {
            memory -= val;
        }
    } catch {
        // Игнорировать ошибки
    }
}

function customOperation(): void {
    // Индивидуальная операция: десятичный логарифм log10(x)
    applyUnaryOperation(n => n <= 0 ? null : Math.log10(n));
}

function changeBackgroundColor(): void {
    const colors = ['#121826', '#0d1b1e', '#1a1a2e', '#16213e'];
    const current = document.body.style.backgroundColor || getComputedStyle(document.body).backgroundColor;
    const index = colors.findIndex(c => current.includes(c.replace('#', '')));
    const nextColor = colors[(index + 1) % colors.length];
    document.body.style.backgroundColor = nextColor;
    document.body.style.backgroundImage = 'none';
}

function changeDisplayColor(): void {
    const colors = ['#4fc3f7', '#69f0ae', '#ff9800', '#e91e63'];
    const current = displayElement.style.color || getComputedStyle(displayElement).color;
    // Простая смена по кругу
    const index = colors.findIndex(c => current.includes(c.replace('#', '')));
    displayElement.style.color = colors[(index + 1) % colors.length];
}


function areBracketsBalanced(expression: string): boolean {
    let count = 0;
    for (const char of expression) {
        if (char === '(') count++;
        else if (char === ')') {
            count--;
            if (count < 0) return false;
        }
    }
    return count === 0;
}

function calculate(): void {
    try {
        let expr = displayElement.value.trim();
        if (expr === '') {
            displayElement.value = 'Error';
            return;
        }

        if (!areBracketsBalanced(expr)) {
            displayElement.value = 'Error';
            return;
        }


        expr = expr.replace(/(^|[(+*\/-])-([0-9.])/, '$1(0-$2)');

        if (/[+\-*/(]$/.test(expr) || /^[+*/)]/.test(expr)) {
            displayElement.value = 'Error';
            return;
        }

        if (/[^0-9+\-*/().\s]/.test(expr)) {
            displayElement.value = 'Error';
            return;
        }

        // Пропущенный оператор: 5( или )5 → не поддерживаем умножение по умолчанию
        if (/[0-9][(]/.test(expr) || /[)][(0-9]/.test(expr)) {
            displayElement.value = 'Error';
            return;
        }

        const result = eval(expr) as unknown;
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            displayElement.value = 'Error';
        } else {
            displayElement.value = parseFloat(result.toFixed(10)).toString();
        }
    } catch {
        displayElement.value = 'Error';
    }
}

(window as any).appendToDisplay = appendToDisplay;
(window as any).clearDisplay = clearDisplay;
(window as any).calculate = calculate;
(window as any).backspace = backspace;
(window as any).toggleSign = toggleSign;
(window as any).percentage = percentage;
(window as any).sqrt = sqrt;
(window as any).square = square;
(window as any).factorial = factorial;
(window as any).addTripleZero = addTripleZero;
(window as any).memoryAdd = memoryAdd;
(window as any).memorySubtract = memorySubtract;
(window as any).customOperation = customOperation; // log10
(window as any).changeBackgroundColor = changeBackgroundColor;
(window as any).changeDisplayColor = changeDisplayColor;