
const board = document.querySelector(".board");
const h1 = document.querySelector(".h1");
const menu = document.querySelector(".menu");
const answer = document.querySelector(".answer");

const word = words[
    Math.floor(Math.random() * words.length)
].toLowerCase();

let currentRow = 0;
let letters = 0;
let gameOver = false;

// Создаём поле: 6 строк по 5 клеток.
for (let i = 0; i < 30; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
}

const cells = document.querySelectorAll(".cell");

cells[0].classList.add("active");
cells[0].classList.add("radius");
cells[4].classList.add("radius2");
cells[25].classList.add("radius3");
cells[29].classList.add("radius4");

// Индекс клетки всегда вычисляется из текущей строки
// и количества введённых букв.
function getCellIndex() {
    return currentRow * 5 + letters;
}

// Ввод буквы — единая функция для обеих клавиатур.
function enterLetter(letter) {
    if (gameOver || letters >= 5 || currentRow >= 6) {
        return;
    }

    const index = getCellIndex();
    const cell = cells[index];

    if (!cell) return;

    cell.textContent = letter.toLowerCase();
    cell.classList.remove("active");
    cell.classList.add("pop");

    setTimeout(() => {
    cell.classList.remove("pop");
}, 180);

    letters++;

    // Выделяем следующую клетку только внутри текущей строки.
    if (letters < 5) {
        cells[getCellIndex()].classList.add("active");
    }
}

// Удаление последней введённой буквы.
function deleteLetter() {
    if (gameOver || letters <= 0) return;

    letters--;

    const index = getCellIndex();
    const cell = cells[index];

    cell.textContent = "";
    cell.classList.remove("color1", "color2", "color3", "flip");
    cells[index+1].classList.remove("active");
    cell.classList.add("active");
}

// Проверка слова и переход на следующую строку.
function submitRow() {
    const rowStart = currentRow * 5;
    const anim = rowStart + 5;

    if (gameOver || currentRow >= 6) {
        return;
    }

    if (letters !== 5) {
        Array.from(cells).slice(rowStart, anim).forEach(cell => {
            cell.classList.remove("anim");
            void cell.offsetWidth;
            cell.classList.add("anim");
        });

        return;
    }

    const guess = Array.from(cells)
        .slice(rowStart, rowStart + 5)
        .map(cell => cell.textContent.toLowerCase());

    const remaining = word.split("");


    // Сначала отмечаем правильные буквы на своих местах.
    for (let i = 0; i < 5; i++) {
        if (guess[i] === remaining[i]) {
            cells[rowStart + i].classList.add("color1");
            remaining[i] = null;
        }
    }

    // Затем отмечаем буквы, стоящие не на своих местах.
    for (let i = 0; i < 5; i++) {
        const cell = cells[rowStart + i];

        if (cell.classList.contains("color1")) continue;

        const index = remaining.indexOf(guess[i]);

        if (index !== -1) {
            cell.classList.add("color2");
            remaining[index] = null;
        } else {
            cell.classList.add("color3");
        }
    }

    // Анимация переворота клеток.
    for (let i = 0; i < 5; i++) {
        const cell = cells[rowStart + i];

        setTimeout(() => {
            cell.classList.add("flip");
        }, i * 450);
    }

    // Победа.
    if (guess.join("") === word) {
        finishGame("Ты угадал слово!");
        return;
    }

    // Переходим к следующей строке.
    currentRow++;
    letters = 0;

    if (currentRow >= 6) {
        finishGame("Правильный ответ:");
        return;
    }

    // Новая позиция определяется только номером строки.
    cells.forEach(cell => cell.classList.remove("active"));

    const nextRowStart = currentRow * 5;
    cells[nextRowStart].classList.add("active");
}

// Завершение игры.
function finishGame(message) {
    gameOver = true;

    cells.forEach(cell => cell.classList.remove("active"));

    h1.textContent = message;
    answer.textContent = word;

    menu.classList.add("show");
    document.body.classList.add("dark");
}

// Экранная клавиатура.
document.querySelector(".keyboard").addEventListener("click", event => {
    const button = event.target.closest(".key");

    if (!button || gameOver) return;

    event.preventDefault();

    if (button.classList.contains("key-enter")) {
        submitRow();
        return;
    }

    if (button.classList.contains("key-backspace")) {
        deleteLetter();
        return;
    }

    const letter = button.textContent.trim().toLowerCase();

    if (/^[а-яё]$/i.test(letter)) {
        enterLetter(letter);
    }
});

// Физическая клавиатура использует те же функции.
document.addEventListener("keydown", event => {
    if (gameOver) return;

    if (event.key === "Enter") {
        event.preventDefault();
        submitRow();
        return;
    }

    if (event.key === "Backspace") {
        event.preventDefault();
        deleteLetter();
        return;
    }

    if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.repeat ||
        event.key.length !== 1
    ) {
        return;
    }

    if (/^[а-яё]$/i.test(event.key)) {
        enterLetter(event.key);
    }
});

// Перезапуск игры.
document.querySelector(".restart").addEventListener("click", () => {
    location.reload();
});

// Показываем загаданное слово в заголовке вкладки.
document.querySelector("title").textContent = word;
