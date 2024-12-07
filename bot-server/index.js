const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token
const token = '8013260961:AAFcNPRbbhG4g0eU8SeRmkfBq0JEUVMFunc';
const bot = new TelegramBot(token, { polling: true});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Welcome! Click the button below to open the mini app.', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Launch Mini App',
            web_app: { url: 'https://bet-quest.vercel.app/login' },
          },
        ],
      ],
    },
  });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
  
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
  });
