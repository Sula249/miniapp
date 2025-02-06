document.addEventListener("DOMContentLoaded", () => {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = Telegram.WebApp;
        tg.expand();

        // Инициализация темы
        const updateTheme = () => {
            document.body.style.backgroundColor = tg.themeParams.bg_color || getComputedStyle(document.body).backgroundColor;
            document.body.style.color = tg.themeParams.text_color || getComputedStyle(document.body).color;
        };
        updateTheme();
        tg.onEvent("themeChanged", updateTheme);

        // Все элементы управления
        const mainButton = document.getElementById("mainButton");
        const toggleSearchButton = document.getElementById("toggleSearchButton");
        const searchContainer = document.getElementById("searchContainer");
        const questionContainer = document.getElementById("questionContainer");
        const searchForm = document.getElementById("searchForm");
        const queryInput = document.getElementById("query");
        const questionInput = document.getElementById("questionInput");
        const questionButton = document.getElementById("questionButton");
        const overlay = document.querySelector(".overlay");
        const loader = document.querySelector('.loader');

        // Оригинальные функции анимации
        function toggleButtons() {
            mainButton.classList.toggle("hidden");
            toggleSearchButton.classList.toggle("hidden");
        }

        function showSearch() {
            searchContainer.classList.add("visible");
            questionContainer.classList.remove("visible");
            overlay.classList.add("visible");
        }

        function hideSearch() {
            searchContainer.classList.remove("visible");
            questionContainer.classList.add("visible");
            overlay.classList.remove("visible");
        }

        // Обработчики событий
        mainButton.addEventListener("click", () => {
            toggleButtons();
            showSearch();
        });

        toggleSearchButton.addEventListener("click", () => {
            toggleButtons();
            hideSearch();
        });

        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            loader.classList.add('visible');
            const query = queryInput.value;
            // Отправка запроса
            google.search.cse.element.render(
                { gname: 'searchresults', query: query }
            );
        });

        questionButton.addEventListener("click", function(event) {
            event.preventDefault();
            alert("Этот функционал будет реализован позже!");
        });
    }
});
