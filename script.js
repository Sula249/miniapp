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
        tg.BackButton.hide();
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
    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;
        
        // Логируем запрос
        logQueryToGoogleSheets(query, 'search');
        
        // Ждем инициализации Google CSE
        const waitForGCSE = setInterval(() => {
            if (google && google.search && google.search.cse) {
                clearInterval(waitForGCSE);
                // Выполняем поиск
                google.search.cse.element.getElement('results').execute(query);
            }
        }, 100);
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
            xhr.setRequestHeader('Authorization', `Bearer ${CONFIG.OPENROUTER_API_KEY}`);
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
        const scriptUrl = CONFIG.GOOGLE_SHEETS_URL;
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

    // Добавляем обработчик для результатов поиска
    document.addEventListener('click', (e) => {
        // Проверяем, является ли клик по ссылке в результатах поиска
        if (e.target.closest('.gs-title a, .gs-visibleUrl a')) {
            e.preventDefault();
            const url = e.target.href;
            if (url) {
                // Открываем ссылку во встроенном браузере Telegram
                tg.openLink(url);
            }
        }
    });
});
