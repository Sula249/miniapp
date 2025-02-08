const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/ask-deepseek', async (req, res) => {
    const { question } = req.body;
    try {
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [{ role: "user", content: question }],
            max_tokens: 150
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            }
        });
        res.json({ answer: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Ошибка при запросе к DeepSeek:', error);
        res.status(500).json({ error: 'Произошла ошибка при обработке вашего вопроса.' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
