let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const questionButton = document.getElementById("questionButton");

    function toggleButtons() {
        if (searchButton.classList.contains("visible")) {
            searchButton.classList.add("slide-out");
            questionButton.classList.remove("slide-out");
            questionButton.classList.add("slide-in");

            setTimeout(() => {
                searchButton.classList.remove("visible");
                questionButton.classList.add("visible");
            }, 400);
        } else {
            questionButton.classList.add("slide-out");
            searchButton.classList.remove("slide-out");
            searchButton.classList.add("slide-in");

            setTimeout(() => {
                questionButton.classList.remove("visible");
                searchButton.classList.add("visible");
            }, 400);
        }
    }

    searchButton.addEventListener("click", toggleButtons);
    questionButton.addEventListener("click", toggleButtons);
});
