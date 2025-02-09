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
    z-index: 60;
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
    z-index: 50;
    opacity: 0;
    pointer-events: none;
}

.inputContainer.visible {
    transform: translateX(-50%) translateY(-68px);
    opacity: 1;
    pointer-events: auto;
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
    min-width: 150px;
}

@media (max-width: 500px) {
    .inputContainer input {
        min-width: 100px;
    }
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

.gcse-searchresults-only {
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 120px;
    overflow-y: auto;
    padding: 10px;
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
    z-index: 20 !important; /* Ниже чем у вопросов */
    max-height: calc(100vh - 220px);
    display: none;
}

.gsc-control-cse {
    background: transparent !important;
    border: none !important;
    padding: 10px !important;
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
    z-index: 40;
    display: none;
}

.loader.visible {
    display: block;
}

@keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.gsc-webResult.gsc-result {
    background: var(--tg-theme-secondary-bg-color, #f0f0f0) !important;
    border-radius: 8px !important;
    margin-bottom: 12px !important;
    border: none !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

.gs-title {
    color: var(--tg-theme-link-color, #0088cc) !important;
    font-size: 18px !important;
    text-decoration: none !important;
    font-family: var(--tg-font-family, Arial, sans-serif) !important;
}

.gs-title:hover {
    text-decoration: underline !important;
}

.gs-snippet {
    color: var(--tg-theme-text-color, #000000) !important;
    font-size: 15px !important;
    line-height: 1.4 !important;
    font-family: var(--tg-font-family, Arial, sans-serif) !important;
}

.gs-url {
    color: var(--tg-theme-hint-color, #707579) !important;
    font-size: 13px !important;
}

.gsc-cursor-page {
    color: var(--tg-theme-button-color, #0088cc) !important;
    border: none !important;
    background: transparent !important;
    font-family: var(--tg-font-family, Arial, sans-serif) !important;
}

.gsc-cursor-current-page {
    color: var(--tg-theme-text-color, #000000) !important;
    font-weight: bold !important;
}

.gsc-search-button {
    padding: 8px !important;
    margin-left: 5px !important;
}

.gsc-input-box {
    border-radius: 6px !important;
    border-color: var(--tg-theme-hint-color, #ccc) !important;
    background: var(--tg-theme-secondary-bg-color, #f0f0f0) !important;
}

.question-results {
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 120px;
    overflow-y: auto;
    padding: 10px;
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
    z-index: 30 !important; /* Приоритет над всеми элементами */
    max-height: calc(100vh - 220px);
    display: none;
}

.question-result {
    background: var(--tg-theme-bg-color, #ffffff) !important;
    border-radius: 8px !important;
    margin-bottom: 12px !important;
    border: none !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    padding: 15px;
}

.question-title {
    color: var(--tg-theme-text-color, #000000) !important;
    font-size: 18px !important;
    font-family: var(--tg-font-family, Arial, sans-serif) !important;
    margin-bottom: 8px;
    font-weight: bold;
}

.question-content {
    color: var(--tg-theme-text-color, #000000) !important;
    font-size: 15px !important;
    line-height: 1.4 !important;
    font-family: var(--tg-font-family, Arial, sans-serif) !important;
}

@media (max-width: 500px) {
    .question-result {
        margin-bottom: 8px !important;
        padding: 13px !important;
    }
    
    .question-title {
        font-size: 15px !important;
    }
    
    .question-content {
        font-size: 13px !important;
    }
}
