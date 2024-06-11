import 'dotenv/config';
import { Bot, GrammyError, HttpError, InlineKeyboard, Keyboard } from 'grammy';

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
  const startKeyboard = new Keyboard()
    .text('HTML')
    .text('CSS')
    .row()
    .text('JavaScript')
    .text('React')
    .resized();

  await ctx.reply(
    'Привет! Я бот-фронтендер! 🌚\nЯ помогу тебе подготовиться к собеседованию по HTML, CSS, JavaScript и React!'
  );

  await ctx.reply('Что хочешь повторить?', {
    reply_markup: startKeyboard,
  });
});

bot.hears(['HTML', 'CSS', 'JavaScript', 'React'], (ctx) => {
  const inlineKeybord = new InlineKeyboard()
    .text(
      'Показать ответ',
      JSON.stringify({
        type: ctx.message.text,
        questionId: 1,
      })
    )
    .text('Отменить', 'cancel');

  ctx.reply(`Что такое ${ctx.message.text}?`, {
    reply_markup: inlineKeybord,
  });
});

bot.on('callback_query:data', async (ctx) => {
  if (ctx.callbackQuery.data === 'cancel') {
    await ctx.reply('Отменено!');
    await ctx.answerCallbackQuery('Галя, отмена!');
    return;
  }

  const callbackData = JSON.parse(ctx.callbackQuery.data);
  await ctx.reply(`${callbackData.type} - составляющая фронтенда.`);
  await ctx.answerCallbackQuery();
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
