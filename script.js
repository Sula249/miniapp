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
            tg.BackButton.show(); // Показываем кнопку "Назад"
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
            tg.BackButton.show(); // Показываем кнопку "Назад"
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
                resultsContainer.style.display = 'none'; // Скрываем результаты поиска
            }
            tg.BackButton.hide(); // Скрываем кнопку "Назад"
        }

        // Обработчики событий
        mainButton.addEventListener("click", showSearch);
        toggleSearchButton.addEventListener("click", showQuestion);
        overlay.addEventListener("click", () => {
            window.history.back(); // Возвращаемся назад в истории
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
                        hideAll(); // Сворачиваем поисковую строку при загрузке результатов
                        if (resultsContainer) {
                            resultsContainer.style.display = 'block'; // Показываем результаты поиска
                        }
                        tg.BackButton.show(); // Показываем кнопку "Назад"
                    }
                }
            });
        });

        // Следим за всем документом для отлова динамически добавляемых результатов
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Обработка кнопки "Назад" в Telegram
        tg.BackButton.onClick(() => {
            window.history.back(); // Откат на предыдущую страницу
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
// Добавьте API-ключ DeepSeek
const DEEPSEEK_API_KEY = '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'; // Замените на ваш ключ

// Функция для отправки запроса к DeepSeek API
async function askDeepSeek(question) {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat", // Укажите модель DeepSeek
                messages: [{ role: "user", content: question }],
                max_tokens: 150 // Максимальное количество токенов в ответе
            })
        });

        const data = await response.json();
        return data.choices[0].message.content; // Возвращаем ответ от DeepSeek
    } catch (error) {
        console.error('Ошибка при запросе к DeepSeek:', error);
        return 'Произошла ошибка при обработке вашего вопроса.';
    }
}

// Обновите обработчик кнопки "Задать вопрос"
questionButton.addEventListener("click", async () => {
    const question = questionInput.value.trim();
    if (question) {
        loader.classList.add('visible'); // Показываем загрузчик
        try {
            const answer = await askDeepSeek(question); // Получаем ответ от DeepSeek
            displayAnswer(answer); // Отображаем ответ
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при обработке вашего вопроса.');
        } finally {
            loader.classList.remove('visible'); // Скрываем загрузчик
        }
        questionInput.value = ''; // Очищаем поле ввода
    } else {
        alert("Введите вопрос.");
    }
});

// Функция для отображения ответа
function displayAnswer(answer) {
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="gsc-webResult gsc-result">
                <div class="gs-title">Ответ:</div>
                <div class="gs-snippet">${answer}</div>
            </div>
        `;
        resultsContainer.style.display = 'block'; // Показываем контейнер с ответом
    }
}
