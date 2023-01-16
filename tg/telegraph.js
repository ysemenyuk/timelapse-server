import { Telegraf } from 'telegraf';
import 'dotenv/config';
// import path from 'path';
// import fs from 'fs';

const token = process.env.TG_TOKEN;

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.on('text', async (ctx) => {
  // Using context shortcut
  await ctx.reply(`Hello ${ctx.chat.username}`);
});

// bot.telegram.sendMessage(802712322, '🙋‍♂️ hello!');
// bot.telegram.sendPhoto(802712322, {
//   source: path.join('C:', 'timelapse', 'timelapse-server', 'tg', 'file-img.png'),
// });

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
