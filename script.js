// Оптимизация обработчиков
function setupEventListeners() {
    const delegates = {
        'mainButton': showSearch,
        'toggleSearchButton': showQuestion,
        'overlay': hideAll,
        'searchForm': handleSearch,
        'questionButton': handleQuestion
    };

    Object.entries(delegates).forEach(([id, handler]) => {
        document.getElementById(id)?.addEventListener('click', handler);
    });
}

// Безопасная обработка поиска
function sanitizeInput(input) {
    return input.replace(/[<>]/g, '').trim();
}

// Улучшенная обработка загрузки
function safelyTriggerSearch(query) {
    const cleanQuery = sanitizeInput(query);
    if (!cleanQuery) return;

    loader.classList.add('visible');
    
    Promise.all([
        logQueryToGoogleSheets(cleanQuery),
        triggerGoogleSearch(cleanQuery)
    ])
    .catch(handleSearchError)
    .finally(resetLoaderState);
}

// Более надежная логика
function handleSearchError(error) {
    console.error('Search error:', error);
    tg.showAlert('Не удалось выполнить поиск. Проверьте подключение.');
}
