import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

const token = process.env.TG_TOKEN;

const users = [];

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  //   console.log('user', chatId, resp);
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/register/, (msg) => {
  const chatId = msg.chat.id;
  users.push(chatId);
  //   console.log('registered', chatId);
  bot.sendMessage(chatId, 'Done.');
});

bot.sendMessage(802712322, '🙋‍♂️ hello!');
