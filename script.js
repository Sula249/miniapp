let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");

    searchButton.addEventListener("click", () => {
        if (searchButton.innerText === "Начать поиск") {
            searchButton.innerText = "Задать вопрос";
        } else {
            searchButton.innerText = "Начать поиск";
        }
        searchButton.classList.toggle("flipped");
    });
});
