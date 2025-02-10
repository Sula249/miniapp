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
        
        // API ключ
        const API_KEY = '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';
        
        // Показываем индикатор загрузки
        questionActionButton.disabled = true;
        questionActionButton.textContent = "Загрузка...";
        
        try {
            // Проверяем соединение
            if (!navigator.onLine) {
                throw new Error('Нет подключения к интернету');
            }

            console.log('Отправка запроса к API...');
            
            // Используем XMLHttpRequest вместо fetch
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://openrouter.ai/api/v1/chat/completions', true);
            
            // Устанавливаем заголовки
            xhr.setRequestHeader('Authorization', `Bearer ${API_KEY}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('HTTP-Referer', 'https://openrouter.ai/docs');
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
                    console.error('API Error:', xhr.status, xhr.statusText);
                    alert(`Ошибка сервера: ${xhr.status}`);
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
            
            // Отправляем запрос
            xhr.send(JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.'
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            }));
            
        } catch (error) {
            console.error('Error details:', error);
            alert(`Ошибка: ${error.message}`);
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
