const questions = require('./questions.json');

const getRandomQuestion = (topic) => {
  const questionTopic = topic.toLowerCase();

  const randomQuestionIndex = Math.floor(
    Math.random() * questions[questionTopic].length,
  );
  return questions[questionTopic][randomQuestionIndex];
};

const getRandomTopic = () => {
  const questionTopics = Object.keys(questions);
  return questionTopics[Math.floor(Math.random() * questionTopics.length)];
};

const getCorrectAnswer = (topic, id) => {
  const questionTopic = topic.toLowerCase();

  const question = questions[questionTopic].find(
    (question) => question.id === id,
  );

  if (!question.hasOptions) {
    return question.answer;
  }

  return question.options.find((option) => option.isCorrect).text;
};

module.exports = { getRandomQuestion, getRandomTopic, getCorrectAnswer };
