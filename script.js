let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const questionButton = document.getElementById("questionButton");

    function toggleButtons() {
        if (searchButton.style.opacity === "1") {
            // Первая кнопка уезжает вправо
            searchButton.classList.add("slide-out");
            searchButton.classList.remove("slide-in");

            // Вторая кнопка приезжает слева
            questionButton.classList.add("slide-in");
            questionButton.classList.remove("slide-out");

            setTimeout(() => {
                searchButton.style.opacity = "0";
                questionButton.style.opacity = "1";
            }, 500);
        } else {
            // Вторая кнопка уезжает вправо
            questionButton.classList.add("slide-out");
            questionButton.classList.remove("slide-in");

            // Первая кнопка приезжает слева
            searchButton.classList.add("slide-in");
            searchButton.classList.remove("slide-out");

            setTimeout(() => {
                questionButton.style.opacity = "0";
                searchButton.style.opacity = "1";
            }, 500);
        }
    }

    searchButton.addEventListener("click", toggleButtons);
    questionButton.addEventListener("click", toggleButtons);
});
