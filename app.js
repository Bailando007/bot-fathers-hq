// app.js
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

const bots = {
  Kit: new TelegramBot(process.env.KIT_BOT_TOKEN, { polling: true }),
  C3PO: new TelegramBot(process.env.C3PO_BOT_TOKEN, { polling: true }),
  Jarvis: new TelegramBot(process.env.JARVIS_BOT_TOKEN, { polling: true }),
  Marvin: new TelegramBot(process.env.MARVIN_BOT_TOKEN, { polling: true })
};

const handleCommand = async (botName, msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  const payload = {
    bot: botName,
    command: text,
    user: msg.from.username || msg.from.first_name,
    chat_id: chatId
  };

  const response = `[${botName}] Acknowledged: "${text}"`; 
  bots[botName].sendMessage(chatId, response);
};

for (const [botName, bot] of Object.entries(bots)) {
  bot.onText(/.*/, (msg) => handleCommand(botName, msg));
}

app.get('/', (req, res) => {
  res.send('Bot Fathers HQ Gateway Running');
});

app.listen(PORT, () => {
  console.log(`Bot Fathers HQ listening on port ${PORT}`);
});