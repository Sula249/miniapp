document.addEventListener("DOMContentLoaded", () => {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();

        // ... остальные объявления переменных ...

        function hideAll() {
            searchContainer.classList.remove("visible");
            questionContainer.classList.remove("visible");
            overlay.classList.remove("visible");
            mainButton.classList.remove("hidden");
            toggleSearchButton.classList.add("hidden");
            if (resultsContainer) {
                resultsContainer.style.display = 'none';
            }
            // Убираем кнопку назад при скрытии результатов
            tg.BackButton.hide();
        }

        // Обновленная функция показа результатов
        function showResults() {
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
            }
            // Показываем кнопку назад и добавляем новый обработчик
            tg.BackButton.show();
            // Удаляем предыдущий обработчик перед добавлением нового
            tg.BackButton.offClick();
            tg.BackButton.onClick(() => {
                hideAll();
                // Очищаем результаты поиска
                if (resultsContainer) {
                    resultsContainer.innerHTML = '';
                }
            });
        }

        // Обновляем observer для отслеживания результатов
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
                        showResults(); // Используем новую функцию для показа результатов
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});
