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
        const searchResultsContainer = document.getElementById('searchResultsContainer');
        const closeResultsButton = document.getElementById('closeResultsButton');
        const dragHandle = document.querySelector('.drag-handle');

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
            hideSearchResults();
        }

        function showSearchResults() {
            hideAll(); // Сворачиваем строку поиска
            searchResultsContainer.classList.add('visible');
        }

        function hideSearchResults() {
            searchResultsContainer.classList.remove('visible');
        }

        // Обработчики событий
        mainButton.addEventListener("click", showSearch);
        toggleSearchButton.addEventListener("click", showQuestion);
        overlay.addEventListener("click", hideAll);
        closeResultsButton.addEventListener("click", hideSearchResults);

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
                    showSearchResults(); // Показываем результаты с анимацией
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

        // Перетаскивание плашки
        let isDragging = false;
        let startY, startBottom;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startBottom = parseInt(window.getComputedStyle(searchResultsContainer).bottom, 10);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            const deltaY = startY - e.clientY;
            const newBottom = startBottom + deltaY;
            const maxBottom = window.innerHeight - 60; // Максимальная высота, чтобы не перекрывать кнопки
            const minBottom = 60; // Минимальная высота, чтобы оставить полосу

            if (newBottom >= minBottom && newBottom <= maxBottom) {
                searchResultsContainer.style.bottom = `${newBottom}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // Двойной клик для сворачивания плашки
        dragHandle.addEventListener('dblclick', () => {
            const minBottom = 60; // Минимальная высота, чтобы оставить полосу
            searchResultsContainer.style.bottom = `${minBottom}px`;
        });

        // Сворачивание строки поиска при клике в любое место
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target) && !questionContainer.contains(e.target)) {
                hideAll();
            }
        });

        // Свайп вверх для разворачивания плашки
        let touchStartY = 0;
        let touchStartBottom = 0;

        searchResultsContainer.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartBottom = parseInt(window.getComputedStyle(searchResultsContainer).bottom, 10);
        });

        searchResultsContainer.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            const newBottom = touchStartBottom + deltaY;
            const maxBottom = window.innerHeight - 60; // Максимальная высота, чтобы не перекрывать кнопки
            const minBottom = 60; // Минимальная высота, чтобы оставить полосу

            if (newBottom >= minBottom && newBottom <= maxBottom) {
                searchResultsContainer.style.bottom = `${newBottom}px`;
            }
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