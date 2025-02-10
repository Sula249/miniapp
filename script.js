let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const questionButton = document.getElementById("questionButton");

    function toggleButtons() {
        if (searchButton.classList.contains("hidden")) {
            questionButton.classList.add("slide-out");
            searchButton.classList.remove("hidden");
            searchButton.classList.add("slide-in");
            
            setTimeout(() => {
                questionButton.classList.add("hidden");
                questionButton.classList.remove("slide-out", "slide-in");
            }, 400);
        } else {
            searchButton.classList.add("slide-out");
            questionButton.classList.remove("hidden");
            questionButton.classList.add("slide-in");

            setTimeout(() => {
                searchButton.classList.add("hidden");
                searchButton.classList.remove("slide-out", "slide-in");
            }, 400);
        }
    }

    searchButton.addEventListener("click", toggleButtons);
    questionButton.addEventListener("click", toggleButtons);
});
