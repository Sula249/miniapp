let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.getElementById("searchContainer");
    const questionContainer = document.getElementById("questionContainer");

    // Включаем кнопку "Назад" в Telegram
    tg.BackButton.onClick(() => {
        searchContainer.classList.remove("show");
        questionContainer.classList.remove("show");
        tg.BackButton.hide(); // Скрываем кнопку "Назад"
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

    // Add event listeners for search and question action buttons
    const searchActionButton = document.getElementById("searchActionButton");
    const questionActionButton = document.getElementById("questionActionButton");
    const searchInput = document.getElementById("searchInput");
    const questionInput = document.getElementById("questionInput");

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

    questionActionButton.addEventListener("click", async () => {
        const question = questionInput.value.trim();
        if (!question) return;
        
        // Показываем индикатор загрузки
        questionActionButton.disabled = true;
        questionActionButton.textContent = "Загрузка...";
        
        try {
            console.log('Отправка запроса к API...');
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Telegram Mini App',
                    'Origin': window.location.origin
                },
                mode: 'no-cors', // Пробуем режим no-cors
                body: JSON.stringify({
                    model: 'mistralai/mistral-7b-instruct',
                    messages: [
                        {
                            role: 'user',
                            content: question
                        }
                    ],
                    max_tokens: 500
                })
            }).catch(error => {
                console.error('Network Error Details:', {
                    error: error,
                    message: error.message,
                    type: error.type
                });
                throw new Error('Не удалось подключиться к серверу AI. Пожалуйста, попробуйте позже.');
            });

            console.log('Получен ответ от сервера:', response);

            // В режиме no-cors мы не можем прочитать тело ответа напрямую
            // Поэтому делаем второй запрос для получения данных
            const dataResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Telegram Mini App',
                    'Origin': window.location.origin
                },
                body: JSON.stringify({
                    model: 'mistralai/mistral-7b-instruct',
                    messages: [
                        {
                            role: 'user',
                            content: question
                        }
                    ],
                    max_tokens: 500
                })
            });

            if (!dataResponse.ok) {
                console.error('API Error:', {
                    status: dataResponse.status,
                    statusText: dataResponse.statusText
                });
                throw new Error('Сервер вернул ошибку. Попробуйте позже.');
            }

            const data = await dataResponse.json();
            console.log('Получены данные:', data);
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error('Неверный формат данных:', data);
                throw new Error('Получен некорректный ответ от сервера');
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
            console.error('Полные детали ошибки:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            alert(`Ошибка: ${error.message}`);
        } finally {
            // Восстанавливаем кнопку
            questionActionButton.disabled = false;
            questionActionButton.textContent = "Задать";
        }
    });

    // Function to log queries to Google Sheets
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
                    type: type // 'search' or 'question'
                })
            });
        } catch (error) {
            console.error('Error logging to Google Sheets:', error);
        }
    }
});
