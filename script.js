body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
    margin: 0;
    font-family: var(--tg-font-family, Arial, sans-serif);
    background: var(--tg-theme-bg-color, #ffffff);
    color: var(--tg-theme-text-color, #000000);
    transition: background-color 0.3s, color 0.3s;
}

#title {
    margin-top: 20px;
    z-index: 10;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    transition: background-color 0.3s ease;
    pointer-events: none;
    z-index: 1;
}

.overlay.visible {
    background: rgba(0, 0, 0, 0.5);
    pointer-events: auto;
}

.container {
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 20px);
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 25; /* Кнопки над плашкой */
}

.inputContainer {
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%) translateY(3px);
    width: calc(100% - 20px);
    max-width: 500px;
    background: var(--tg-theme-bg-color, #ffffff);
    padding: 5px;
    border-radius: 8px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    box-sizing: border-box;
    z-index: 20; /* Строка поиска над плашкой */
    opacity: 1;
    pointer-events: auto;
}

.inputContainer.hidden {
    opacity: 0;
    pointer-events: none;
}

.inputContainer .wrapper {
    display: flex;
    gap: 5px;
    width: 100%;
}

.inputContainer input {
    flex: 1;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid var(--tg-theme-hint-color, #ccc);
    border-radius: 6px;
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
    color: var(--tg-theme-text-color, #000000);
    box-sizing: border-box;
    transition: border-color 0.3s ease;
}

.inputContainer input:focus {
    outline: none;
    border-color: var(--tg-theme-button-color, #0088cc);
}

.inputContainer button {
    padding: 12px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    background-color: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    border-radius: 6px;
    transition: opacity 0.3s ease;
}

.inputContainer button:active {
    opacity: 0.8;
}

.toggleButton {
    width: 100%;
    padding: 15px;
    font-size: 18px;
    cursor: pointer;
    border: none;
    background-color: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    transition: transform 0.2s ease, opacity 0.3s ease;
    border-radius: 8px;
    margin-bottom: env(safe-area-inset-bottom, 0px);
    transform-origin: center;
    backface-visibility: hidden;
}

.toggleButton:active {
    transform: scale(0.98);
    opacity: 0.9;
}

.hidden {
    display: none;
}

.flip {
    animation: flip 0.3s ease forwards;
}

@keyframes flip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(90deg); }
    100% { transform: rotateY(180deg); }
}

.toggleButton.flipBack {
    animation: flipBack 0.3s ease forwards;
}

@keyframes flipBack {
    0% { transform: rotateY(180deg); }
    50% { transform: rotateY(90deg); }
    100% { transform: rotateY(0deg); }
}

/* Стили для плашки с результатами поиска */
.search-results-container {
    position: fixed;
    bottom: -100%; /* Начальное положение за пределами экрана */
    left: 0;
    right: 0;
    height: 70%; /* Высота плашки */
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    transition: bottom 0.5s ease-in-out;
    z-index: 15; /* Плашка под кнопками */
}

.search-results-container.visible {
    bottom: 60px; /* Плашка открывается, оставляя место для кнопок */
}

/* Полоса для растягивания */
.drag-handle {
    width: 40px;
    height: 4px;
    background: var(--tg-theme-hint-color, #ccc);
    border-radius: 2px;
    margin: 8px auto;
    cursor: pointer;
}

/* Крестик закрытия */
.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: var(--tg-theme-text-color, #000000);
    cursor: pointer;
    z-index: 21;
}

/* Результаты поиска */
.gcse-searchresults-only {
    height: calc(100% - 40px); /* Учитываем полосу и крестик */
    overflow-y: auto;
    padding: 20px;
}

.loader {
    border: 4px solid var(--tg-theme-secondary-bg-color, #f0f0f0);
    border-top: 4px solid var(--tg-theme-button-color, #0088cc);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    display: none;
}

.loader.visible {
    display: block;
}

@keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
