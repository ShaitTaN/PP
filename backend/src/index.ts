import { getAuth } from "firebase-admin/auth";
import TelegramBot from "node-telegram-bot-api";
import express, { Express, Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { FbAdmin } from "./firebaseAdmin";
import events from "events";
import { FbMessage } from "./models";
const cors = require("cors");

// Telegram bot
const token = "5720047994:AAHSRgeRX9Kv0tCr4ErmZS0ItyozQ7gFSSg";
const bot = new TelegramBot(token, { polling: true });
const webAppUrl = "https://remarkable-crostata-72b9ae.netlify.app";

// Express init
const PORT = 3040;
const app: Express = express();
const emitter = new events.EventEmitter();

// Middleware
app.use(cors());
app.use(express.json());

// Bot logic
const createKeyboard = () => {
  return {
    reply_markup: {
      keyboard: [
        [{ text: "Авторизоваться", web_app: { url: webAppUrl + "/auth" } }],
        [
          {
            text: "Проверить серийный номер",
            web_app: { url: webAppUrl + "/serial" },
          },
        ],
        [
          {
            text: "Добавить серийный номер",
            web_app: { url: webAppUrl + "/serial-add" },
          },
        ],
				[
					{
						text: "Выход",
						web_app: { url: webAppUrl + "/logout" },
					}
				]
      ],
    },
  };
};

bot.setMyCommands([{ command: "/menu", description: "Меню" }]);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  // console.log(msg)
  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "Здравствуйте, для начала авторизуйтесь.",
      createKeyboard()
    );
  }
  if (text === "/menu") {
    await bot.sendMessage(chatId, "Выберите нужное действие", createKeyboard());
  }

  // Если персонал отправил сообщение пользователю
  if (msg.reply_to_message) {
    const text = msg.reply_to_message.text!;
    const email = text?.split(" ")[2];
    const newMessage = { text: msg.text!, from: "personal", to: email };
    await FbAdmin.addMessageDoc(newMessage);
    emitter.emit("newMessage", newMessage);
  }

  // Если пришел ответ от веб-приложения
  if (msg?.web_app_data?.data) {
    // console.log(msg.web_app_data)
    const data = JSON.parse(msg.web_app_data.data);
    console.log(data);
    // Получаем всех админов
    const adminUsers = await FbAdmin.getUsersDocsWhere("group", "admin");
    // Проверка авторизован ли пользоваиель и получение пользователя
    let authUID = null;
    try {
      const decodeToken = await admin.auth().verifyIdToken(data.idToken);
      authUID = decodeToken.uid;
    } catch (error) {
      console.log(error);
    }
    console.log('authUID - ', authUID);
		// Если пользователь авторизован, получаем его 
    const currentUser = authUID
      ? await FbAdmin.getUserDoc(`${msg.chat?.id}`)
      : null;
    const userGroup = currentUser ? currentUser.group : "user";
    console.log('userGroup - ', userGroup);

    switch (data.msg) {
      case "add_serial_code":
        if (userGroup === "user") {
          await bot.sendMessage(chatId, "У вас нет прав!");
          break;
        }
        await FbAdmin.addSerialCodeDoc(
          data.serialCode,
          data.country,
          data.diller
        );
        await bot.sendMessage(chatId, "Серийный номер добавлен!");
        break;

      case "get_serial_code":
        const serialCode = await FbAdmin.getSerialCodeDoc(data.serialCode);
        if (serialCode) {
          await bot.sendMessage(
            chatId,
            `Серийный номер: ${serialCode.code}\nСтрана: ${serialCode.country}\nДиллер: ${serialCode.diller} \nДата выдачи: ${serialCode.date}`
          );
          break;
        }
        await bot.sendMessage(chatId, "Серийный номер не найден");
        break;

      case "authorization":
        await getAuth().updateUser(data.result.user.uid, {
          email: data.email,
        });
        // Если все ок, то добавляем в коллекцию case1 документ с флагом VYDACHA
        await FbAdmin.addCase1Doc("VYDACHA", msg);
        // Добавляем в коллекцию users документ с данными пользователя
        await FbAdmin.addUserDoc(`${msg.chat?.id}`, msg, data);
        await bot.sendMessage(chatId, `${msg.chat.username} вы авторизованы`);
        // Отправляем всем админам сообщение о том, что пользователь авторизован
        if (adminUsers) {
          adminUsers!.forEach((doc) => {
            bot.sendMessage(
              doc.data().chatId,
              `${msg.chat.username} ${userGroup} успешная выдача ключа`
            );
          });
        }
        break;

      case "authorized":
        await bot.sendMessage(
          chatId,
          `${msg.chat.username} вы уже авторизованы`
        );
        break;

      case "invalid_code":
        // Если ошибка, то добавляем в коллекцию case1 документ с флагом VZLOM
        await FbAdmin.addCase1Doc("VZLOM", msg);
        await bot.sendMessage(
          chatId,
          `${msg.chat.username} неверный код авторизации`
        );
        // Отправляем всем админам сообщение о том, что пользователь не авторизован
        if (adminUsers) {
          adminUsers.forEach((doc) => {
            bot.sendMessage(
              doc.data().chatId,
              `${msg.chat.username} ${userGroup} попытка взлома`
            );
          });
        }
        break;

				case 'logout':
					bot.sendMessage(chatId, 'Вы вышли из аккаунта');
					break;
				
				case 'logoutError':
					console.log('logoutError', data.error);
    }
  }
});

// Express routes
app.post("/serial", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, application/json"
  );
  const serialCodeReq = req.body.serialCode;
  const serialCode = await FbAdmin.getSerialCodeDoc(serialCodeReq);
  res.json(serialCode);
  res.end();
});

// long polling
app.get("/message", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, application/json"
  );
  emitter.once("newMessage", (message: any) => {
    res.json(message);
  });
});

app.post("/message", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, application/json"
  );
  const message: FbMessage = req.body;
  FbAdmin.addMessageDoc(message);
  // Отправляем сообщение всему персоналу
  const personal = await FbAdmin.getUsersDocsWhere("group", "personal");
  personal?.forEach((doc) => {
    bot.sendMessage(
      doc.data().chatId,
      `Сообщение от: ${message.from} \n ${message.text}`
    );
  });
  emitter.emit("newMessage", message);
  res.status(200);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});