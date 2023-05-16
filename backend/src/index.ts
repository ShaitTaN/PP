import { getAuth } from "firebase-admin/auth";
import TelegramBot from "node-telegram-bot-api";
import express, { Express, Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { FbAdmin } from "./firebaseAdmin";
import events from "events";
import { FbMessage } from "./models";
const cors = require("cors");
import { EXPRESS_PORT, TG_TOKEN, WEB_APP_URL } from "./config";
import { download } from "./utils";
import {
  addJson,
  addMessage,
  addSerialCode,
  addSortedSet,
  collections,
  createUser,
  getHash,
  getKey,
  getKeys,
  redisClient,
  setHash,
} from "./redis";

// Telegram bot init
const bot = new TelegramBot(TG_TOKEN, { polling: true });

// Redis init
redisClient.connect();
redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Express init
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
        // [{ text: "Авторизоваться", web_app: { url: WEB_APP_URL + "/auth" } }],
        [
          {
            text: "Проверить серийный номер",
            web_app: { url: WEB_APP_URL + "/serial" },
          },
        ],
        [
          {
            text: "Добавить серийный номер",
            web_app: { url: WEB_APP_URL + "/serial-add" },
          },
        ],
        // [
        //   {
        //     text: "Выход",
        //     web_app: { url: WEB_APP_URL + "/logout" },
        //   },
        // ],
      ],
    },
  };
};

// Команды бота
const botCommands = {
  menu: {
    command: "/menu",
    text: "Выберите нужное действие",
    desription: "Меню",
  },
  files: {
    command: "/files",
    text: "Введите uid",
    description: "Найти все файлы с uid пользователя",
  },
};

bot.setMyCommands([
  {
    command: botCommands.menu.command,
    description: botCommands.menu.desription,
  },
  {
    command: botCommands.files.command,
    description: botCommands.files.description,
  },
]);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  // console.log(msg)

  let rawUser = await getHash(collections.USERS, `${msg.chat.id}`);
  if (!rawUser) {
    createUser(`${msg.chat.id}`, msg.chat.username || "anonymous");
    rawUser = await getHash(collections.USERS, `${msg.chat.id}`);
  }
  const currentUser = JSON.parse(rawUser!);
  const userGroup = currentUser ? currentUser.group : "user";
  console.log("userGroup - ", userGroup);

  if (text === "/start") {
    await bot.sendMessage(chatId, "Добро пожаловать!", createKeyboard());
  }
  if (text === "/menu") {
    await bot.sendMessage(chatId, botCommands.menu.text, createKeyboard());
  }
  if (text === "/files") {
    const message = await bot.sendMessage(chatId, botCommands.files.text, {
      reply_markup: { force_reply: true },
    });
  }

  // Если персонал отправил документ
  if (msg.document) {
    const document = msg.document;
    console.log(document);
    const fileId = document.file_id;
    const filePath = await (await bot.getFile(fileId)).file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${TG_TOKEN}/${filePath}`;
    console.log(fileId);

    download(downloadUrl, async (body, err) => {
      try {
        await addJson(`${chatId}`, document.file_name || "json", body, fileId);
        await bot.sendMessage(
          chatId,
          `Файл ${document.file_name} добавлен в базу`
        );
      } catch (e) {
        bot.sendMessage(chatId, `Что-то пошло не так`);
      }
    });
  }

  // Если пользователь ответил на сообщение бота
  if (msg.reply_to_message) {
    const replyToMessage = msg.reply_to_message;
    const text = replyToMessage.text!;

    if (text === botCommands.files.text) {
      const fileNames = await getKeys(`${msg.text}:*`);
      console.log(fileNames);
      if (fileNames.length > 0) {
        fileNames.forEach(async (fileName) => {
          const file = await getKey(fileName);
          const parsedFile = JSON.parse(file!);
          bot.sendDocument(msg.chat.id, parsedFile.fileId);
        });
      } else {
        bot.sendMessage(msg.chat.id, "У пользователя с таким uid нет файлов");
        // addSortedSet(collections.LOGS, [Date.now(), "KEY UNKNOWN"]);
      }
    }
    // Если пользователь ответил не на команду бота
    if (!Object.values(botCommands).some((cmd) => cmd.text === text)) {
      const email = text?.split(" ")[2];
      const newMessage = { text: msg.text!, from: "personal", to: email };
      await addMessage(newMessage);
      emitter.emit("newMessage", newMessage);
    }
  }

  // Если пришел ответ от веб-приложения
  if (msg?.web_app_data?.data) {
    // console.log(msg.web_app_data)
    const data = JSON.parse(msg.web_app_data.data);
    console.log(data);
    // Получаем всех админов
    const adminUsers = await FbAdmin.getUsersDocsWhere("group", "admin");
    // Проверка авторизован ли пользоваиель и получение пользователя
    // let authUID = null;
    // try {
    //   const decodeToken = await admin.auth().verifyIdToken(data.idToken);
    //   authUID = decodeToken.uid;
    // } catch (error) {
    //   console.log(error);
    // }
    // console.log("authUID - ", authUID);
    // Если пользователь авторизован, получаем его

    switch (data.msg) {
      case "add_serial_code":
        // if (userGroup === "user") {
        //   await bot.sendMessage(chatId, "У вас нет прав!");
        //   break;
        // }
        await addSerialCode(data.serialCode, data.country, data.diller);
        await bot.sendMessage(chatId, "Серийный номер добавлен!");
        break;

      case "get_serial_code":
        const serialCode = JSON.parse(
          (await getHash(collections.SERIAL_CODES, data.serialCode))!
        );
        if (serialCode) {
          await bot.sendMessage(
            chatId,
            `Серийный номер: ${serialCode.code}\nСтрана: ${serialCode.country}\nДиллер: ${serialCode.diller} \nДата выдачи: ${serialCode.date}`
          );
          break;
        }
        await bot.sendMessage(chatId, "Серийный номер не найден");
        break;

      // case "authorization":
      //   await getAuth().updateUser(data.result.user.uid, {
      //     email: data.email,
      //   });
      //   // Если все ок, то добавляем в коллекцию case1 документ с флагом VYDACHA
      //   await FbAdmin.addCase1Doc("VYDACHA", msg);
      //   // Добавляем в коллекцию users документ с данными пользователя
      //   await FbAdmin.addUserDoc(`${msg.chat?.id}`, msg, data);
      //   await bot.sendMessage(chatId, `${msg.chat.username} вы авторизованы`);
      //   // Отправляем всем админам сообщение о том, что пользователь авторизован
      //   if (adminUsers) {
      //     adminUsers!.forEach((doc) => {
      //       bot.sendMessage(
      //         doc.data().chatId,
      //         `${msg.chat.username} ${userGroup} успешная выдача ключа`
      //       );
      //     });
      //   }
      //   break;

      // case "authorized":
      //   await bot.sendMessage(
      //     chatId,
      //     `${msg.chat.username} вы уже авторизованы`
      //   );
      //   break;

      // case "invalid_code":
      //   // Если ошибка, то добавляем в коллекцию case1 документ с флагом VZLOM
      //   await FbAdmin.addCase1Doc("VZLOM", msg);
      //   await bot.sendMessage(
      //     chatId,
      //     `${msg.chat.username} неверный код авторизации`
      //   );
      //   // Отправляем всем админам сообщение о том, что пользователь не авторизован
      //   if (adminUsers) {
      //     adminUsers.forEach((doc) => {
      //       bot.sendMessage(
      //         doc.data().chatId,
      //         `${msg.chat.username} ${userGroup} попытка взлома`
      //       );
      //     });
      //   }
      //   break;

      // case "logout":
      //   bot.sendMessage(chatId, "Вы вышли из аккаунта");
      //   break;

      // case "logoutError":
      //   console.log("logoutError", data.error);
      //   break;

      // case "not_authorized":
      //   bot.sendMessage(chatId, "Вы еще не авторизованы");
      //   break;
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
  const serialCode = await JSON.parse(
    (await getHash(collections.SERIAL_CODES, serialCodeReq))!
  );
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
  addMessage(message);
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

app.listen(EXPRESS_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${EXPRESS_PORT}`
  );
});
