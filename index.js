import 'dotenv/config';
import { Bot } from 'grammy';

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', (ctx) => {
  ctx.reply('Привет! Я бот-фронтендер!');
});

bot.start();
