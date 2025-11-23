// src/main.ts

const displayElement = document.getElementById('display') as HTMLInputElement;

if (!displayElement) {
    throw new Error('Элемент с id="display" не найден в DOM.');
}

/**
 * Добавляет значение на дисплей с учётом правил ввода чисел
 */
function appendToDisplay(value: string): void {
    let current = displayElement.value;

    // Сброс при ошибке
    if (current === 'Error') {
        displayElement.value = '';
        current = '';
    }

    // Обработка цифр (0-9)
    if (/[0-9]/.test(value)) {
        // Если дисплей пуст — можно ввести только '0' или другую цифру
        if (current === '') {
            displayElement.value = value === '0' ? '0' : value;
            return;
        }

        // Разбираем последнее "число" в выражении (то, что после последнего оператора/скобки)
        const lastPart = current.split(/[/+*()-]/).pop() || '';

        // Случай: последнее число — просто "0" (и не дробь)
        if (lastPart === '0') {
            if (value === '0') {
                // Запрещаем 00
                return;
            } else {
                // Заменяем 0 на другую цифру: 0 → 5
                displayElement.value = current.slice(0, -1) + value;
                return;
            }
        }

        // Случай: последнее число — десятичная дробь, начинающаяся с 0 (0.5)
        if (/^0\.\d*$/.test(lastPart)) {
            // Разрешаем добавлять цифры: 0.5 → 0.50
            displayElement.value += value;
            return;
        }

        // Случай: последнее число начинается с 0 и НЕ содержит точки → ошибка (теоретически не должно быть)
        if (/^0\d+$/.test(lastPart)) {
            // Заменяем всё число на новую цифру
            const base = current.slice(0, current.length - lastPart.length);
            displayElement.value = base + value;
            return;
        }
    }

    // Для всех остальных символов (операторы, скобки, точка) — просто добавляем
    displayElement.value += value;
}

/**
 * Очищает дисплей
 */
function clearDisplay(): void {
    displayElement.value = '';
}

/**
 * Проверяет, сбалансированы ли скобки в выражении
 */
function areBracketsBalanced(expression: string): boolean {
    let count = 0;
    for (const char of expression) {
        if (char === '(') {
            count++;
        } else if (char === ')') {
            count--;
            if (count < 0) return false; // Закрывающая скобка без открывающей
        }
    }
    return count === 0; // Все скобки закрыты
}

/**
 * Вычисляет выражение и отображает результат
 */
function calculate(): void {
    try {
        let expr = displayElement.value.trim();

        if (expr === '') {
            displayElement.value = 'Error';
            return;
        }

        // Проверка скобок
        if (!areBracketsBalanced(expr)) {
            displayElement.value = 'Error';
            return;
        }

        // Недопустимые позиции
        if (/[+\-*/(]$/.test(expr)) {
            displayElement.value = 'Error';
            return;
        }
        if (/^[+*/)]/.test(expr)) {
            displayElement.value = 'Error';
            return;
        }

        // Запрещённые символы
        if (/[^0-9+\-*/().\s]/.test(expr)) {
            displayElement.value = 'Error';
            return;
        }

        // Двойные операторы (кроме унарного минуса)
        if (/[+\-*/]{2,}/.test(expr.replace(/\+-/g, '-'))) {
            displayElement.value = 'Error';
            return;
        }

        // Пропущенный оператор: 5( или )5
        if (/[0-9][(]/.test(expr) || /[)][(0-9]/.test(expr)) {
            displayElement.value = 'Error';
            return;
        }

        // Вычисление
        const result = eval(expr) as unknown;

        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            displayElement.value = 'Error';
        } else {
            // Округление для устранения 0.30000000000000004
            displayElement.value = parseFloat(result.toFixed(10)).toString();
        }
    } catch {
        displayElement.value = 'Error';
    }
}

// === РЕГИСТРАЦИЯ ФУНКЦИЙ В ГЛОБАЛЬНОЙ ОБЛАСТИ ===
// Чтобы они работали в HTML: onclick="appendToDisplay('7')"
(window as any).appendToDisplay = appendToDisplay;
(window as any).clearDisplay = clearDisplay;
(window as any).calculate = calculate;