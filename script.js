document.addEventListener("DOMContentLoaded", () => {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = Telegram.WebApp;
        tg.expand();
        tg.BackButton.onClick(() => window.history.back());

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

        // Функция для управления кнопкой "Назад"
        const updateBackButton = () => {
            if (window.history.length > 1) {
                tg.BackButton.show();
            } else {
                tg.BackButton.hide();
            }
        };

        // Оригинальные функции анимации
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
            mainButton.classList.add("flip");
            toggleSearchButton.classList.add("flipBack");
            window.history.pushState({page: 'search'}, '', '#search');
            updateBackButton();
            setTimeout(() => {
                mainButton.classList.remove("flip");
                toggleSearchButton.classList.remove("flipBack");
            }, 600); 
        }

        function showQuestion() {
            questionContainer.classList.add("visible");
            searchContainer.classList.remove("visible");
            overlay.classList.add("visible");
            questionInput.focus();
            toggleButtons();
            toggleSearchButton.classList.add("flip");
            mainButton.classList.add("flipBack");
            window.history.pushState({page: 'question'}, '', '#question');
            updateBackButton();
            setTimeout(() => {
                toggleSearchButton.classList.remove("flip");
                mainButton.classList.remove("flipBack");
            }, 600); 
        }

        function hideAll() {
            searchContainer.classList.remove("visible");
            questionContainer.classList.remove("visible");
            overlay.classList.remove("visible");
            mainButton.classList.remove("hidden");
            toggleSearchButton.classList.add("hidden");
            updateBackButton();
        }

        // Обработчики событий
        mainButton.addEventListener("click", showSearch);
        toggleSearchButton.addEventListener("click", showQuestion);
        overlay.addEventListener("click", hideAll);

        // Обработка поиска
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
                    queryInput.value = ''; // очищаем поле ввода
                } else {
                    throw new Error('Элементы поиска не найдены');
                }
            } catch (error) {
                console.error('Ошибка поиска:', error);
                alert('Произошла ошибка при выполнении поиска');
            } finally {
                setTimeout(() => loader.classList.remove('visible'), 1000);
            }
        });

        questionButton.addEventListener("click", () => {
            const question = questionInput.value.trim();
            if (question) {
                alert(`Вопрос: ${question}`);
                questionInput.value = ''; // очищаем поле ввода
            } else {
                alert("Введите вопрос.");
            }
        });

        // Открытие ссылок в новых вкладках
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    // Находим все ссылки в результатах поиска
                    const searchResults = document.querySelector('.gsc-results-wrapper-overlay') || document.getElementById('results');
                    if (searchResults) {
                        searchResults.querySelectorAll('a').forEach(link => {
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                        });
                    }
                    
                    if (document.querySelector('.gsc-result') || document.querySelector('.gsc-no-results')) {
                        loader.classList.remove('visible');
                    }
                }
            });
        });

        // Следим за всем документом для отлова динамически добавляемых результатов
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Обработка навигации браузера
        window.addEventListener('popstate', (event) => {
            if (!event.state) {
                hideAll();
            } else if (event.state.page === 'search') {
                showSearch();
            } else if (event.state.page === 'question') {
                showQuestion();
            }
            updateBackButton();
        });

        // Инициализация состояния кнопки "Назад"
        updateBackButton();

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