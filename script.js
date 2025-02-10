let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const questionButton = document.getElementById("questionButton");

    function toggleButtons() {
        if (searchButton.style.opacity === "1") {
            // Первая кнопка уходит вправо
            searchButton.classList.add("slide-out");
            searchButton.classList.remove("slide-in");

            // Вторая кнопка заезжает слева
            questionButton.classList.add("slide-in");
            questionButton.classList.remove("slide-out");

            setTimeout(() => {
                searchButton.style.opacity = "0";
                questionButton.style.opacity = "1";
                searchButton.style.left = "100%";
                questionButton.style.left = "0";
            }, 500);
        } else {
            // Вторая кнопка уходит вправо
            questionButton.classList.add("slide-out");
            questionButton.classList.remove("slide-in");

            // Первая кнопка заезжает слева
            searchButton.classList.add("slide-in");
            searchButton.classList.remove("slide-out");

            setTimeout(() => {
                questionButton.style.opacity = "0";
                searchButton.style.opacity = "1";
                questionButton.style.left = "-100%";
                searchButton.style.left = "0";
            }, 500);
        }
    }

    searchButton.addEventListener("click", toggleButtons);
    questionButton.addEventListener("click", toggleButtons);
});
