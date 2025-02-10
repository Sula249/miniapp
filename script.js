let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");

    searchButton.addEventListener("click", () => {
        searchButton.classList.add("flipped");

        setTimeout(() => {
            searchButton.innerText = searchButton.innerText === "Начать поиск" 
                ? "Задать вопрос" 
                : "Начать поиск";
            searchButton.classList.remove("flipped");
        }, 300); // Меняем текст после половины анимации (0.3s)
    });
});

