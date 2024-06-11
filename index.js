import 'dotenv/config';
import { Bot, GrammyError, HttpError } from 'grammy';

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
  await ctx.reply(
    'Привет! Я бот-фронтендер! 🌚\nЯ помогу тебе подготовиться к собеседованию по HTML, CSS, JavaScript и React!'
  );
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

bot.start();
