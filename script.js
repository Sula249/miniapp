let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const inputContainer = document.getElementById("inputContainer");
    const inputField = document.getElementById("inputField");
    const inputActionButton = document.getElementById("inputActionButton");

    searchButton.addEventListener("click", () => {
        searchButton.classList.add("flipped");

        setTimeout(() => {
            if (searchButton.innerText === "Начать поиск") {
                searchButton.innerText = "Задать вопрос";
                inputActionButton.innerText = "Поиск";
                inputField.placeholder = "Введите запрос...";
            } else {
                searchButton.innerText = "Начать поиск";
                inputActionButton.innerText = "Задать";
                inputField.placeholder = "Введите вопрос...";
            }

            searchButton.classList.remove("flipped");

            // Переключаем видимость поля ввода
            inputContainer.classList.toggle("show");
        }, 300);
    });
});
