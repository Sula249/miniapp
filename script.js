let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
    const mainTitle = document.querySelector('h1');
    const userPhoto = document.getElementById('userPhoto');
    
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const userName = tg.initDataUnsafe.user.first_name;
        mainTitle.textContent = `Привет, ${userName}!`;
        
        // Получаем фото пользователя
        if (tg.initDataUnsafe.user.photo_url) {
            userPhoto.style.backgroundImage = `url(${tg.initDataUnsafe.user.photo_url})`;
        }
    }

    const searchButton = document.getElementById("searchButton");
    const searchContainer = document.getElementById("searchContainer");
    const questionContainer = document.getElementById("questionContainer");

    // Устанавливаем начальное состояние
    searchButton.innerText = "❓ Задать вопрос";
    searchContainer.classList.add("show");
    questionContainer.classList.remove("show");

    // Показываем кнопку "Назад"
    tg.BackButton.show();

    searchButton.addEventListener("click", () => {
        searchButton.classList.add("flipped");
        const mainTitle = document.querySelector('h1');
        mainTitle.classList.add("flipped");

        setTimeout(() => {
            if (searchButton.innerText === "🔎 Начать поиск") {
                searchButton.innerText = "";
                mainTitle.textContent = "Linkee iBot | Поиск";
                searchContainer.classList.add("show");
                questionContainer.classList.remove("show");
                // Показываем элементы поиска Google и скрываем элементы AI
                const searchElements = document.querySelectorAll('.gsc-control-cse, .gsc-results-wrapper-visible');
                const aiElements = document.querySelectorAll('#aiAnswer, #questionInput');
                searchElements.forEach(el => {
                    if (el) el.style.display = '';
                });
                aiElements.forEach(el => {
                    if (el) el.style.display = 'none';
                });
            } else {
                searchButton.innerText = "🔎 Начать поиск";
                mainTitle.textContent = "Linkee iBot | Поиск";
                questionContainer.classList.add("show");
                searchContainer.classList.remove("show");
                // Скрываем элементы поиска Google и показываем элементы AI
                const searchElements = document.querySelectorAll('.gsc-control-cse, .gsc-results-wrapper-visible');
                const aiElements = document.querySelectorAll('#aiAnswer, #questionInput');
                searchElements.forEach(el => {
                    if (el) el.style.display = 'none';
                });
                aiElements.forEach(el => {
                    if (el) el.style.display = '';
                });
            }

            searchButton.classList.remove("flipped");
            mainTitle.classList.remove("flipped");

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
        
        // Показываем индикатор загрузки
        searchActionButton.disabled = true;
        searchActionButton.textContent = "Загрузка...";
        
        // Логируем запрос
        logQueryToGoogleSheets(query, 'search');
        
        // Выполняем поиск через Google CSE
        const searchElement = document.querySelector('input.gsc-input');
        if (searchElement) {
            searchElement.value = query;
            const searchButton = document.querySelector('button.gsc-search-button');
            searchButton.click();
            
            // Добавляем обработчик для восстановления кнопки после загрузки результатов
            const observer = new MutationObserver((mutations, obs) => {
                const results = document.querySelector('.gsc-results-wrapper-visible');
                if (results) {
                    searchActionButton.disabled = false;
                    searchActionButton.textContent = "Поиск";
                    obs.disconnect(); // Прекращаем наблюдение после восстановления кнопки
                }
            });

            // Начинаем наблюдение за появлением результатов
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Таймаут на случай, если результаты не загрузятся
            setTimeout(() => {
                searchActionButton.disabled = false;
                searchActionButton.textContent = "Поиск";
                observer.disconnect();
            }, 5000); // 5 секунд таймаут
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
            xhr.setRequestHeader('Authorization', API_KEY);
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

    // Включаем кнопку "Назад" в Telegram
    tg.BackButton.onClick(() => {
        // Закрываем поисковую выдачу и ответы на вопросы
        searchContainer.classList.remove("show");
        questionContainer.classList.remove("show");

        // Скрываем все элементы при возврате
        const searchElements = document.querySelectorAll('.gsc-control-cse, .gsc-results-wrapper-visible');
        const aiElements = document.querySelectorAll('#aiAnswer, #questionInput');
        searchElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
        aiElements.forEach(el => {
            if (el) el.style.display = 'none';
        });

        // Скрываем кнопку "Назад", если ничего не открыто
        if (!searchContainer.classList.contains("show") && !questionContainer.classList.contains("show")) {
            tg.BackButton.hide();
        }
    });
});
