require('dotenv').config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require('grammy');
const {
  getRandomQuestion,
  getRandomTopic,
  getCorrectAnswer,
} = require('./utils');

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
  const startKeyboard = new Keyboard()
    .text('HTML')
    .text('CSS')
    .row()
    .text('JavaScript')
    .text('React')
    .row()
    .text('Случайный вопрос')
    .resized();

  await ctx.reply(
    'Привет! Я бот-фронтендер! 🌚\nЯ помогу тебе подготовиться к собеседованию по HTML, CSS, JavaScript и React!',
  );

  await ctx.reply('Что хочешь повторить?', {
    reply_markup: startKeyboard,
  });
});

bot.hears(['HTML', 'CSS', 'JavaScript', 'React', 'Случайный вопрос'], (ctx) => {
  const topic = ctx.message.text;
  let randomTopic;
  let selectedTopic;
  let question;

  if (topic === 'Случайный вопрос') {
    randomTopic = getRandomTopic();
    selectedTopic = randomTopic;
    question = getRandomQuestion(randomTopic);
  } else {
    question = getRandomQuestion(topic);
    selectedTopic = topic;
  }

  let inlineKeybord;

  if (question.hasOptions) {
    const buttonRows = question.options.map((option) => [
      InlineKeyboard.text(
        option.text,
        JSON.stringify({
          type: `${selectedTopic}-option`,
          isCorrect: option.isCorrect,
          questionId: question.id,
        }),
      ),
    ]);

    inlineKeybord = InlineKeyboard.from(buttonRows);
  } else {
    inlineKeybord = new InlineKeyboard().text(
      'Узнать ответ',
      JSON.stringify({
        type: selectedTopic,
        questionId: question.id,
      }),
    );
  }

  ctx.reply(question.text, {
    reply_markup: inlineKeybord,
  });
});

bot.on('callback_query:data', async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data);

  if (!callbackData.type.includes('option')) {
    const answer = getCorrectAnswer(callbackData.type, callbackData.questionId);
    await ctx.reply(answer, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
    await ctx.answerCallbackQuery();
    return;
  }

  if (callbackData.isCorrect) {
    await ctx.reply('Правильно ✅');
    await ctx.answerCallbackQuery();
    return;
  }

  const answer = getCorrectAnswer(
    callbackData.type.split('-')[0],
    callbackData.questionId,
  );

  await ctx.reply(`Неправильно. Правильный ответ: ${answer}`);
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
