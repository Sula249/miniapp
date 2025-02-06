document.addEventListener("DOMContentLoaded", () => {
    if (window.Telegram?.WebApp) {
        const tg = Telegram.WebApp;
        tg.expand();

        const updateTheme = () => {
            document.body.style.backgroundColor = tg.themeParams?.bg_color || getComputedStyle(document.body).backgroundColor;
            document.body.style.color = tg.themeParams?.text_color || getComputedStyle(document.body).color;
        };
        updateTheme();
        tg.onEvent("themeChanged", updateTheme);
    }

    const mainButton = document.getElementById("mainButton");
    const toggleSearchButton = document.getElementById("toggleSearchButton");
    const searchForm = document.getElementById("searchForm");
    const queryInput = document.getElementById("query");
    const questionButton = document.getElementById("questionButton");
    const questionInput = document.getElementById("questionInput");
    const loader = document.querySelector(".loader");

    mainButton.addEventListener("click", () => {
        document.getElementById("searchContainer").classList.toggle("visible");
    });

    toggleSearchButton.addEventListener("click", () => {
        document.getElementById("questionContainer").classList.toggle("visible");
    });

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const query = queryInput.value.trim();
        if (!query) return;
        loader.classList.add("visible");
        try {
            await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ query })
            });
        } catch (error) {
            console.error("Ошибка логирования запроса:", error);
        } finally {
            loader.classList.remove("visible");
        }
    });

    questionButton.addEventListener("click", () => {
        const question = questionInput.value.trim();
        if (question) {
            alert(`Вопрос: ${question}`);
            questionInput.value = "";
        } else {
            alert("Введите вопрос.");
        }
    });
});
