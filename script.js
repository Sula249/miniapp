let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.getElementById("searchContainer");
    const questionContainer = document.getElementById("questionContainer");
    const resultsDiv = document.getElementById("results");

    // Расширяем приложение на весь экран
    tg.expand();

    // Проверяем, возвращаемся ли мы с внешней страницы
    const savedState = localStorage.getItem('savedState');
    if (savedState) {
        const state = JSON.parse(savedState);
        resultsDiv.innerHTML = state.content;
        if (state.searchVisible) {
            searchContainer.classList.add("show");
        }
        if (state.questionVisible) {
            questionContainer.classList.add("show");
        }
        searchButton.innerText = state.buttonText;
        localStorage.removeItem('savedState');
        tg.BackButton.show();
    }

    // Обработка внешних ссылок
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.startsWith(window.location.origin)) {
            e.preventDefault();
            
            // Сохраняем состояние в localStorage
            const state = {
                content: resultsDiv.innerHTML,
                searchVisible: searchContainer.classList.contains("show"),
                questionVisible: questionContainer.classList.contains("show"),
                buttonText: searchButton.innerText
            };
            localStorage.setItem('savedState', JSON.stringify(state));

            // Открываем ссылку в новом окне
            window.open(link.href, '_blank');
        }
    });

    // Обработка изменений viewport
    window.Telegram.WebApp.onEvent('viewportChanged', () => {
        tg.expand();
    });

    // Обработка события beforeunload
    window.addEventListener('beforeunload', () => {
        // Если есть сохраненное состояние и мы переходим по внешней ссылке
        if (localStorage.getItem('savedState')) {
            // Добавляем текущий URL в историю
            history.pushState({ returnUrl: window.location.href }, '', window.location.href);
        }
    });

    searchButton.addEventListener("click", () => {
        searchButton.classList.add("flipped");

        setTimeout(() => {
            if (searchButton.innerText === "Начать поиск") {
                searchButton.innerText = "Задать вопрос";
                searchContainer.classList.add("show");
                questionContainer.classList.remove("show");
            } else {
                searchButton.innerText = "Начать поиск";
                questionContainer.classList.add("show");
                searchContainer.classList.remove("show");
            }

            searchButton.classList.remove("flipped");

            // Показываем кнопку "Назад", если есть активное поле ввода
            if (searchContainer.classList.contains("show") || questionContainer.classList.contains("show")) {
                tg.BackButton.show();
            } else {
                tg.BackButton.hide();
            }
        }, 300);
    });

    // Обработчики для поиска и вопросов
    const searchActionButton = document.getElementById("searchActionButton");
    const questionActionButton = document.getElementById("questionActionButton");
    const searchInput = document.getElementById("searchInput");
    const questionInput = document.getElementById("questionInput");

    // Обработчик поиска
    searchActionButton.addEventListener("click", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;
        
        // Логируем запрос
        logQueryToGoogleSheets(query, 'search');
        
        // Выполняем поиск через Google CSE
        const searchElement = document.querySelector('input.gsc-input');
        if (searchElement) {
            searchElement.value = query;
            document.querySelector('button.gsc-search-button').click();
        }
    });

    // Обработчик вопросов к AI
    questionActionButton.addEventListener("click", async () => {
        const question = questionInput.value.trim();
        if (!question) return;
        
        // Показываем индикатор загрузки
        questionActionButton.disabled = true;
        questionActionButton.textContent = "Загрузка...";
        
        try {
            // Проверяем соединение
            if (!navigator.onLine) {
                throw new Error('Нет подключения к интернету');
            }

            console.log('Отправка запроса к API...');
            
            // Используем XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://openrouter.ai/api/v1/chat/completions', true);
            
            // Устанавливаем заголовки
            xhr.setRequestHeader('Authorization', 'Bearer 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');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('HTTP-Referer', 'https://openrouter.ai/');
            xhr.setRequestHeader('X-Title', 'Telegram Mini App');
            
            // Обработка ответа
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log('Ответ от API:', data);
                        
                        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                            throw new Error('Некорректный формат ответа');
                        }
                        
                        // Создаем или обновляем элемент для ответа
                        let answerElement = document.getElementById('aiAnswer');
                        if (!answerElement) {
                            answerElement = document.createElement('div');
                            answerElement.id = 'aiAnswer';
                            questionContainer.appendChild(answerElement);
                        }
                        
                        // Отображаем ответ
                        answerElement.textContent = data.choices[0].message.content;
                        
                        // Логируем вопрос
                        logQueryToGoogleSheets(question, 'question');
                        
                    } catch (error) {
                        console.error('Ошибка обработки ответа:', error);
                        alert('Ошибка при обработке ответа от сервера');
                    }
                } else {
                    console.error('API Error:', xhr.status, xhr.responseText);
                    if (xhr.status === 401) {
                        alert('Ошибка авторизации. Пожалуйста, проверьте API ключ.');
                    } else {
                        alert(`Ошибка сервера: ${xhr.status}`);
                    }
                }
                
                // Восстанавливаем кнопку
                questionActionButton.disabled = false;
                questionActionButton.textContent = "Задать";
            };
            
            // Обработка ошибок сети
            xhr.onerror = function() {
                console.error('Network Error');
                alert('Ошибка сети при отправке запроса');
                questionActionButton.disabled = false;
                questionActionButton.textContent = "Задать";
            };
            
            // Формируем тело запроса
            const requestBody = {
                model: "mistralai/mistral-7b-instruct",
                messages: [
                    {
                        role: "user",
                        content: question
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            };
            
            console.log('Отправляемые данные:', requestBody);
            
            // Отправляем запрос
            xhr.send(JSON.stringify(requestBody));
            
        } catch (error) {
            console.error('Error details:', error);
            alert(`Ошибка: ${error.message}`);
            questionActionButton.disabled = false;
            questionActionButton.textContent = "Задать";
        }
    });

    // Функция логирования запросов
    async function logQueryToGoogleSheets(text, type) {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbypBtYb0Y8XiGYlEpRyzJq_yqCrE5ieiFwXT92MPsSF29EIFQLmOcp0gZZXasgQb3S9/exec';
        try {
            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    query: text,
                    type: type
                })
            });
        } catch (error) {
            console.error('Error logging to Google Sheets:', error);
        }
    }
});
