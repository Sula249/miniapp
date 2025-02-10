let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const questionButton = document.getElementById("questionButton");

    function toggleButtons() {
        if (searchButton.classList.contains("visible")) {
            // Первая кнопка уезжает вправо
            searchButton.classList.add("slide-out");
            setTimeout(() => {
                searchButton.classList.remove("visible", "slide-out");
                searchButton.style.visibility = "hidden"; // Скрываем кнопку
            }, 400);

            // Вторая кнопка приезжает слева
            questionButton.style.visibility = "visible"; // Показываем кнопку
            questionButton.classList.add("slide-in");
            questionButton.classList.add("visible");
        } else {
            // Вторая кнопка уезжает вправо
            questionButton.classList.add("slide-out");
            setTimeout(() => {
                questionButton.classList.remove("visible", "slide-out");
                questionButton.style.visibility = "hidden"; // Скрываем кнопку
            }, 400);

            // Первая кнопка приезжает слева
            searchButton.style.visibility = "visible"; // Показываем кнопку
            searchButton.classList.add("slide-in");
            searchButton.classList.add("visible");
        }
    }

    searchButton.addEventListener("click", toggleButtons);
    questionButton.addEventListener("click", toggleButtons);
});
