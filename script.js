let tg = window.Telegram.WebApp;
tg.expand();

const button = document.getElementById("toggleButton");

button.addEventListener("click", () => {
    if (button.textContent === "Начать поиск") {
        button.textContent = "Задать вопрос";
    } else {
        button.textContent = "Начать поиск";
    }
});
