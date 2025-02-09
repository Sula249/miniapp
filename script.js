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
        const questionResults = document.getElementById('questionResults');

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
            tg.BackButton.show();
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
            tg.BackButton.show();
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
            if (resultsContainer) {
                resultsContainer.style.display = 'none';
            }
            if (questionResults) {
                questionResults.style.display = 'none';
            }
            tg.BackButton.hide();
        }

        // Обработчики событий
        mainButton.addEventListener("click", showSearch);
        toggleSearchButton.addEventListener("click", showQuestion);
        overlay.addEventListener("click", () => {
            window.history.back();
        });

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
        });

        questionButton.addEventListener("click", () => {
            const question = questionInput.value.trim();
            if (question) {
                // Показываем loader
                loader.classList.add('visible');
                
                // Создаем элемент с вопросом и ответом
                const result = document.createElement('div');
                result.className = 'question-result';
                
                const title = document.createElement('div');
                title.className = 'question-title';
                title.textContent = 'Вопрос: ' + question;
                
                const content = document.createElement('div');
                content.className = 'question-content';
                content.textContent = 'Ответ: Здесь будет ответ на ваш вопрос...';
                
                result.appendChild(title);
                result.appendChild(content);
                
                // Очищаем предыдущие результаты и добавляем новый
                if (questionResults) {
                    questionResults.innerHTML = '';
                    questionResults.appendChild(result);
                    questionResults.style.display = 'block';
                }
                
                // Скрываем контейнер поиска
                if (resultsContainer) {
                    resultsContainer.style.display = 'none';
                }
                
                // Скрываем поисковую строку и показываем кнопку "Назад"
                hideAll();
                tg.BackButton.show();
                
                // Очищаем поле ввода
                questionInput.value = '';
                
                // Скрываем loader через секунду
                setTimeout(() => {
                    loader.classList.remove('visible');
                }, 1000);
            } else {
                alert("Введите вопрос.");
            }
        });

        // Открытие ссылок в новых вкладках
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
                        hideAll();
                        if (resultsContainer) {
                            resultsContainer.style.display = 'block';
                        }
                        tg.BackButton.show();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Обработка кнопки "Назад" в Telegram
        tg.BackButton.onClick(() => {
            window.history.back();
        });

        // Добавляем обработку кнопки "Назад" браузера
        window.addEventListener("popstate", (event) => {
            hideAll();
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
questionInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        questionButton.click();
    }
});
if (questionInput) {
    questionInput.focus();
}
