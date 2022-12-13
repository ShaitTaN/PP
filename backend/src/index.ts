import TelegramBot from "node-telegram-bot-api";
import express, { Express, Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import type { WebAppData } from "./models";
const serviceAccount = require("../fbServiceAccountKey.json");
const cors = require("cors");

// Telegram bot
const token = "5720047994:AAEJpGg3e9jmV1nBc2_tQEoFPNHW2vfSwL0";
const bot = new TelegramBot(token, { polling: true });
const webAppUrl = "https://remarkable-crostata-72b9ae.netlify.app";

// Express init
const PORT = 3030;
const app: Express = express();
// Middleware
app.use(cors());
app.use(express.json());
// Create auth check middleware
function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken as string)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(403).send("Unauthorized!");
      });
  } else {
    res.status(403).send("Unauthorized!");
    return;
  }
}
app.use("/", checkAuth);

// Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://production-practice-1e3bf-default-rtdb.europe-west1.firebasedatabase.app",
});
const db = admin.firestore();

// Firebase collections
const case1DocRef = db.collection("case1");
const usersDocRef = db.collection("users");

// Firebase functions
const getUserDoc = async (tgUserId: string) => {
  const userDoc = await usersDocRef.doc(tgUserId).get();
  if (!userDoc.exists) return null;
  return userDoc.data();
};

const getUsersDocsWhere = async <T>( condition: string, value: T ) => {
	const snapshot = await usersDocRef.where(condition, "==", value).get();
	if(snapshot.empty) return null;
	return snapshot
}

const addCase1Doc = async (
  flag: "VZLOM" | "VYDACHA",
  msg: TelegramBot.Message
) => {
  const userDoc = await getUserDoc(`${msg.chat?.id}`);

  if (userDoc) {
    case1DocRef.add({
      str: Math.cos(Math.random()),
      date: Timestamp.now().toDate().toUTCString(),
      usernamse: msg.chat.username,
      flag: flag,
      group: userDoc.group,
    });
  } else {
    case1DocRef.add({
      str: Math.cos(Math.random()),
      date: Timestamp.now().toDate().toUTCString(),
      usernamse: msg.chat.username,
      flag: flag,
      group: "user",
    });
  }
};

const addUserDoc = async (
  tgUserId: string,
  msg: TelegramBot.Message,
  data: WebAppData
) => {
  const userDoc = await getUserDoc(`${msg.chat?.id}`);
  if (userDoc) return;

  usersDocRef.doc(tgUserId).set({
    uid: data.result.user.uid,
    phone: data.result.user.phoneNumber,
    email: data.email,
    chatId: msg.chat.id,
    tgUsername: msg.chat.username,
    group: "user",
  });
};

// Bot logic
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Нажмите кнопку для авторизации", {
      reply_markup: {
        keyboard: [
          [{ text: "Авторизация", web_app: { url: webAppUrl + "/auth" } }],
        ],
      },
    });
  }

	// Если пришел ответ от веб-приложения
  if (msg?.web_app_data?.data) {
    const data = JSON.parse(msg.web_app_data.data);
		// Получаем всех админов
		const adminUsers = await getUsersDocsWhere("group", "admin");
		// Получение пользователя, который пытается авторизоваться
		const currentUser = await getUserDoc(`${msg.chat?.id}`);
    if (data.error) {
			// Если ошибка, то добавляем в коллекцию case1 документ с флагом VZLOM
      await addCase1Doc("VZLOM", msg);
      await bot.sendMessage(chatId, `${msg.chat.username} ${data.error.code}`);
			// Отправляем всем админам сообщение о том, что пользователь не авторизован
			adminUsers!.forEach((doc) => {
				bot.sendMessage(doc.data().chatId, `${msg.chat.username} ${currentUser ? currentUser.group : "user"} попытка взлома`);
			})
    } else {
			// Если все ок, то добавляем в коллекцию case1 документ с флагом VYDACHA
      await addCase1Doc("VYDACHA", msg);
			// Добавляем в коллекцию users документ с данными пользователя
      await addUserDoc(`${msg.chat?.id}`, msg, data);
      await bot.sendMessage(chatId, `${msg.chat.username} вы авторизованы`);
			// Отправляем всем админам сообщение о том, что пользователь авторизован
			adminUsers!.forEach((doc) => {
				bot.sendMessage(doc.data().chatId, `${msg.chat.username} ${currentUser ? currentUser.group : "user"} успешная выдача ключа`);
			})
    }
  }
});

// Express routes
app.post("/auth", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({
    message: "Auth ok!",
  });
  res.end();
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
