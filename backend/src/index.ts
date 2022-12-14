import TelegramBot from "node-telegram-bot-api";
import express, { Express, Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { FbAdmin } from "./firebaseAdmin";
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
app.use(["/auth", "/serial-add"], checkAuth);

// Bot logic
bot.setMyCommands([
  { command: "/start", description: "Начать работу с ботом" },
  { command: "/auth", description: "Авторизоваться" },
]);
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
    const adminUsers = await FbAdmin.getUsersDocsWhere("group", "admin");
    // Получение пользователя, который пытается авторизоваться
    const currentUser = await FbAdmin.getUserDoc(`${msg.chat?.id}`);
    const userGroup = currentUser ? currentUser.group : "user";
    if (data.error) {
      // Если ошибка, то добавляем в коллекцию case1 документ с флагом VZLOM
      await FbAdmin.addCase1Doc("VZLOM", msg);
      await bot.sendMessage(chatId, `${msg.chat.username} ${data.error.code}`);
      // Отправляем всем админам сообщение о том, что пользователь не авторизован
      if (adminUsers) {
        adminUsers.forEach((doc) => {
          bot.sendMessage(
            doc.data().chatId,
            `${msg.chat.username} ${userGroup} попытка взлома`
          );
        });
      }
    } else {
      // Если все ок, то добавляем в коллекцию case1 документ с флагом VYDACHA
      await FbAdmin.addCase1Doc("VYDACHA", msg);
      // Добавляем в коллекцию users документ с данными пользователя
      await FbAdmin.addUserDoc(`${msg.chat?.id}`, msg, data);
      await bot.sendMessage(chatId, `${msg.chat.username} вы авторизованы`);
      // Отправляем всем админам сообщение о том, что пользователь авторизован
			if(adminUsers){
				adminUsers!.forEach((doc) => {
					bot.sendMessage(
						doc.data().chatId,
						`${msg.chat.username} ${userGroup} успешная выдача ключа`
					);
				})
			}
    }
  }
});

// FbAdmin.addSerialCode('P7,Ln40e6hNC1sVu3.RqQFfxaKI8!_Gl', 'Diller 1')

// Express routes
app.post("/auth", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, application/json"
  );
  const uid = req.body.uid;
  let userGroup = "user";
  if (uid) {
    const users = await FbAdmin.getUsersDocsWhere("uid", uid);
    users?.forEach((doc) => {
      userGroup = doc.data().group;
    });
  }
  res.json({
    message: "Auth ok!",
    userGroup: userGroup,
  });
  res.end();
});

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

app.post("/serial-add", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, application/json"
  );

  const serialCode = req.body.serialCode;
  const country = req.body.country;
  const diller = req.body.diller;

  await FbAdmin.addSerialCode(serialCode, country, diller);

  res.end("ok");
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
