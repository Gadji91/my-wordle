const board = document.querySelector(".board");
const h1 = document.querySelector(".h1");
const menu = document.querySelector(".menu");
const word = words[Math.floor(Math.random() * words.length)];

let currentCell = 0;
let currentRow = 0;
let letters = 0;

// Создание клеток
for (let i = 0; i < 30; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
}

// Переменная каждой одной клетки
const cells = document.querySelectorAll(".cell");

// Делает так, чтобы клетка выделилась и в ней можно было писать
cells[currentCell].classList.add("active");

// Закругляет крайние клетки
cells[0].classList.add("radius");
cells[4].classList.add("radius2");
cells[25].classList.add("radius3");
cells[29].classList.add("radius4");


document.addEventListener("click", function(event) {
    const btn = event.target.closest(".key");  // нашли кнопку
    if (!btn) return;                          // кликнули не по кнопке — выходим

    const letter = btn.textContent.trim().toLowerCase(); // текст кнопки
    if (letter.length === 1  && letter !== "⌫") {                 // если это одна буква
        enterLetter(letter);
    }
});


function enterLetter(letter) {
    if (letters < 5 && currentRow < 6) {
        cells[currentCell].textContent = letter;
        cells[currentCell].classList.remove("active");
        currentCell++;
        letters++;
        if (letters < 5) cells[currentCell].classList.add("active");}
}

document.addEventListener("keydown", function (event) {
    // Ввод буквы
    if (event.key.length === 1 && letters < 5) {
        cells[currentCell].textContent = event.key.toLowerCase();
        cells[currentCell].classList.remove("active");
        currentCell++;
        letters++;
        if (letters < 5) cells[currentCell].classList.add("active");
    }

    // Backspace
    if (event.key === "Backspace" && letters > 0) {
        letters--;
        currentCell--;
        cells[currentCell].textContent = "";
        cells[currentCell + 1].classList.remove("active");
        cells[currentCell].classList.add("active");
    }

    // Enter
    if (event.key === "Enter" && letters === 5) {
         // Буквы игрока
        const p = [];
        for (let i = 0; i < 5; i++) {
            p.push(cells[currentCell - 5 + i].textContent.toLowerCase());
        }
        // Копия загаданного слова
        const w = [];
        for (let i = 0; i < 5; i++) {
            w.push(word[i]);
        }

        // Сначала ищем точные совпадения
        for (let i = 0; i < 5; i++) {
            if (p[i] === w[i]) {
                const cellIndex = currentCell - 5 + i;
                cells[cellIndex].classList.add("color1");
                w[i] = null;
            }
        }

        // Потом ищем буквы, которые есть в слове,
        // но стоят не на своём месте
        for (let i = 0; i < 5; i++) {
            const cellIndex = currentCell - 5 + i;
            if (cells[cellIndex].classList.contains("color1")) continue;
            const index = w.indexOf(p[i]);

            if (index !== -1) {
                cells[cellIndex].classList.add("color2");
                w[index] = null;
            } else { cells[cellIndex].classList.add("color3");}
        }

        for (let i = 0; i < 5; i++) {
            const cellIndex = currentCell - 5 + i;

            setTimeout(() => {
                cells[cellIndex].classList.add("flip");
            }, i * 450); }

        // Проверка победы
        if (p.join("") === word) {
            h1.textContent = "Ты угадал слово!";
            document.querySelector(".answer").textContent = word;
            menu.classList.add("show");
            document.body.classList.add("dark");
        }

        // Переход на следующий ряд
        letters = 0;
        currentRow++;


        if (currentRow < 6) {
            cells[currentCell].classList.add("active");
        } else {
            document.querySelector(".answer").textContent = word;
            h1.textContent = "Правильный ответ:";
            menu.classList.add("show");
            document.body.classList.add("dark");}
    }
});

document.querySelector(".restart").addEventListener("click", function () {
    location.reload();
});

document.querySelector("title").textContent = word;