const { gameOptions, againOptions } = require("/options");
const TelegramApi = require("node-telegram-bot-api");

const token = "6008483044:AAERbX0QtdAyWBFYjOI1Calqsz3hq5tY5Nc";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты должен отгадать"
  );
  const randomNum = Math.floor(Math.random() * 10);
  chats[chatId] = randomNum;
  await bot.sendMessage(chatId, "Я загадал", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Приветствие",
    },
    {
      command: "/info",
      description: "Получить информацию о пользователе",
    },
    {
      command: "/game",
      description: "game",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      return bot.sendMessage(chatId, "Приветствуем Вас в телеграм боте 717");
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        "Ваше имя " + msg.chat.first_name + " " + msg.chat.last_name
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Не знаю такую команду =(");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data == "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      await bot.sendMessage(chatId, "Ты отгадал цифру!", againOptions);
    } else {
      return bot.sendMessage(chatId, "Попробуй еще раз");
    }
  });
};
start();
