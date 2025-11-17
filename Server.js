// Получаем элемент дисплея
const display = document.getElementById('display');

// Функция для добавления значения к текущему отображению
function appendToDisplay(value) {
    if (display.value === "Error") {
        display.value = "";
    }
    display.value += value;
}

// Функция для очистки дисплея
function clearDisplay() {
    display.value = "";
}

// Вспомогательная функция для проверки сбалансированности скобок
function areBracketsBalanced(expression) {
    let count = 0;
    for (let char of expression) {
        if (char === '(') {
            count++;
        } else if (char === ')') {
            count--;
            if (count < 0) return false;
        }
    }
    return count === 0;
}

// Функция для вычисления выражения
function calculate() {
    try {
        let expression = display.value.trim();

        if (expression === "") {
            display.value = "Error";
            return;
        }

        // Проверка на сбалансированность скобок
        if (!areBracketsBalanced(expression)) {
            display.value = "Error";
            return;
        }

        // Не должно заканчиваться на оператор или открывающую скобку
        if (/[+\-*/(]$/.test(expression)) {
            display.value = "Error";
            return;
        }

        // Не должно начинаться с +, *, /, )
        if (/^[+*/)]/.test(expression)) {
            display.value = "Error";
            return;
        }

        // Запрещённые символы
        if (/[^0-9+\-*/().\s]/.test(expression)) {
            display.value = "Error";
            return;
        }

        // Двойные операторы (кроме унарного минуса, например: 5+(-3))
        if (/[+\-*/]{2,}/.test(expression.replace(/\+-/g, '-'))) {
            display.value = "Error";
            return;
        }

        // Число сразу перед открывающей скобкой — ошибка: 5( → должно быть 5*(
        if (/[0-9][(]/.test(expression)) {
            display.value = "Error";
            return;
        }

        // Закрывающая скобка перед числом или открывающей скобкой — ошибка: )5 или )(
        if (/[)][(0-9]/.test(expression)) {
            display.value = "Error";
            return;
        }

        // Вычисление
        let result = eval(expression);

        if (isNaN(result) || !isFinite(result)) {
            display.value = "Error";
        } else {
            // Округляем, чтобы избежать 0.30000000000000004
            display.value = parseFloat(result.toFixed(10)).toString();
        }
    } catch (error) {
        display.value = "Error";
    }
}