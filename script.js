let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.getElementById("searchContainer");
    const questionContainer = document.getElementById("questionContainer");

    // Включаем кнопку "Назад" в Telegram
    tg.BackButton.onClick(() => {
        searchContainer.classList.remove("show");
        questionContainer.classList.remove("show");
        tg.BackButton.hide(); // Скрываем кнопку "Назад"
    });

    searchButton.addEventListener("click", () => {
        searchButton.classList.add("flipped");

        setTimeout(() => {
            if (searchButton.innerText === "Начать поиск") {
                searchButton.innerText = "Задать вопрос";
                searchContainer.classList.add("show");
                questionContainer.classList.remove("show");
            } else {
                searchButton.innerText = "Начать поиск";
                questionContainer.classList.add("show");
                searchContainer.classList.remove("show");
            }

            searchButton.classList.remove("flipped");

            // Показываем кнопку "Назад", если есть активное поле ввода
            if (searchContainer.classList.contains("show") || questionContainer.classList.contains("show")) {
                tg.BackButton.show();
            } else {
                tg.BackButton.hide();
            }
        }, 300);
    });
});
