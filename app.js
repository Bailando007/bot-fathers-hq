// app.js (Webhook version)
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json());

const URL = process.env.RENDER_EXTERNAL_URL || `https://bot-fathers-hq.onrender.com`;

const bots = {
  Kit: new TelegramBot(process.env.KIT_BOT_TOKEN),
  C3PO: new TelegramBot(process.env.C3PO_BOT_TOKEN),
  Jarvis: new TelegramBot(process.env.JARVIS_BOT_TOKEN),
  Marvin: new TelegramBot(process.env.MARVIN_BOT_TOKEN)
};

// Set up webhook endpoints and handlers
for (const [botName, bot] of Object.entries(bots)) {
  const token = bot.token;
  const route = `/bot${token}`;
  bot.setWebHook(`${URL}${route}`);

  app.post(route, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const payload = {
      bot: botName,
      command: text,
      user: msg.from.username || msg.from.first_name,
      chat_id: chatId
    };

    const response = `[${botName}] Acknowledged: "${text}"`;
    bot.sendMessage(chatId, response);
  });
}

app.get('/', (req, res) => {
  res.send('Bot Fathers HQ Webhook Gateway Running');
});

app.listen(PORT, () => {
  console.log(`Bot Fathers HQ webhook server listening on port ${PORT}`);
});
