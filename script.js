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
        const resultsContainer = document.querySelector('.gcse-searchresults-only');

        function toggleButtons() {
            mainButton.classList.toggle("hidden");
            toggleSearchButton.classList.toggle("hidden");
        }

        function showSearch() {
            searchContainer.classList.add("visible");
            questionContainer.classList.remove("visible");
            overlay.classList.add("visible");
            queryInput.focus();
            toggleButtons();
        }

        function showQuestion() {
            questionContainer.classList.add("visible");
            searchContainer.classList.remove("visible");
            overlay.classList.add("visible");
            questionInput.focus();
            toggleButtons();
        }

        function hideAll() {
            searchContainer.classList.remove("visible");
            questionContainer.classList.remove("visible");
            overlay.classList.remove("visible");
            mainButton.classList.remove("hidden");
            toggleSearchButton.classList.add("hidden");
            resultsContainer.style.display = 'none';
            tg.BackButton.hide(); // Меняем "Назад" на "Закрыть"
        }

        mainButton.addEventListener("click", showSearch);
        toggleSearchButton.addEventListener("click", showQuestion);
        overlay.addEventListener("click", hideAll);

        searchForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const query = queryInput.value.trim();
            if (!query) return;

            loader.classList.add('visible');

            try {
                await logQueryToGoogleSheets(query);

                const searchElement = document.querySelector('input.gsc-input');
                const searchButton = document.querySelector('button.gsc-search-button');

                if (searchElement && searchButton) {
                    searchElement.value = query;
                    searchButton.click();
                    queryInput.value = '';
                } else {
                    throw new Error('Элементы поиска не найдены');
                }
            } catch (error) {
                console.error('Ошибка поиска:', error);
                alert('Произошла ошибка при выполнении поиска');
            } finally {
                setTimeout(() => loader.classList.remove('visible'), 1000);
            }

            // Показываем кнопку "Назад" после поиска
            tg.BackButton.show();
        });

        questionButton.addEventListener("click", () => {
            const question = questionInput.value.trim();
            if (question) {
                alert(`Вопрос: ${question}`);
                questionInput.value = '';
            } else {
                alert("Введите вопрос.");
            }
        });

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    const searchResults = document.querySelector('.gsc-results-wrapper-overlay') || document.getElementById('results');
                    if (searchResults) {
                        searchResults.querySelectorAll('a').forEach(link => {
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                        });
                    }

                    if (document.querySelector('.gsc-result') || document.querySelector('.gsc-no-results')) {
                        loader.classList.remove('visible');
                        resultsContainer.style.display = 'block';
                        tg.BackButton.show();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // ✅ КНОПКА "НАЗАД" ТЕПЕРЬ СКРЫВАЕТ ВСЁ!
        tg.BackButton.onClick(() => {
            hideAll(); // Закрываем поиск и результаты
        });

    } else {
        console.warn("Telegram WebApp API недоступен!");
    }
});

async function logQueryToGoogleSheets(query) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbypBtYb0Y8XiGYlEpRyzJq_yqCrE5ieiFwXT92MPsSF29EIFQLmOcp0gZZXasgQb3S9/exec';
    try {
        await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query })
        });
    } catch (error) {
        console.error('Ошибка логирования:', error);
    }
}
