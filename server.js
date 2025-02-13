const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '7417252869:AAGsnqFYDRhmQ4SuTAfab5w-VWRRROHKWiE';
const channelId = '1002442706773';
const bot = new TelegramBot(token, {polling: false});
const app = express();

app.use(cors());

// Получение списка аудио из канала
app.get('/tracks', async (req, res) => {
    try {
        const updates = await bot.getUpdates();
        const audioFiles = updates
            .filter(update => update.channel_post?.audio)
            .map(update => ({
                title: update.channel_post.audio.title,
                file_id: update.channel_post.audio.file_id,
                duration: update.channel_post.audio.duration
            }));
        res.json(audioFiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 