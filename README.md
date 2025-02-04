<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Telegram MiniApp</title>
    <link rel="stylesheet" href="https://telegram.org/css/telegram-web-app.css">
    <style>
        :root {
            --tg-theme-bg-color: #ffffff;
            --tg-theme-text-color: #000000;
        }

        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--tg-font, sans-serif);
            background: var(--tg-theme-bg-color);
            color: var(--tg-theme-text-color);
            transition: background-color 0.2s ease, color 0.2s ease;
        }
    </style>
</head>
<body>
    <div>Telegram MiniApp</div>

    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script>
        (function() {
            const tg = window.Telegram.WebApp;
            
            tg.ready();
            tg.expand();

            function updateTheme() {
                const theme = tg.themeParams;
                document.documentElement.style.setProperty('--tg-theme-bg-color', theme.bg_color || '#ffffff');
                document.documentElement.style.setProperty('--tg-theme-text-color', theme.text_color || '#000000');
            }

            // Первоначальная настройка темы
            updateTheme();

            // Обновление при смене темы
            tg.onEvent('themeChanged', updateTheme);

            // Логирование параметров для отладки
            console.log('Theme Parameters:', tg.themeParams);
        })();
    </script>
</body>
</html>
