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
let isAuth = false;
function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken as string)
      .then(() => {
				isAuth = true;
        next();
      })
      .catch(() => {
				isAuth = false;
        res.status(403).send("Unauthorized!");
      });
  } else {
		isAuth = false;
    res.status(403).send("Unauthorized!");
    return;
  }
}
app.use(["/auth", "/serial-add"], checkAuth);

// Bot logic
const createKeyboard = (text: string, path: string) => {
  return {
    reply_markup: {
      keyboard: [
        [{ text: text, web_app: { url: webAppUrl + path } }],
      ],
    },
  };
};

bot.setMyCommands([
  { command: "/auth", description: "Авторизоваться" },
	{ command: "/serial_add", description: "Добавить серийный номер" },
]);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Нажмите кнопку для авторизации", createKeyboard("Авторизация", "/auth"));
  }
  if (text === "/auth") {
    await bot.sendMessage(chatId, "Нажмите кнопку для авторизации", createKeyboard("Авторизация", "/auth"));
  }
	if (text === "/serial_add") {
		// Получение текущего пользователя
    const currentUser = await FbAdmin.getUserDoc(`${msg.chat?.id}`);
    const userGroup = currentUser ? currentUser.group : "user";
		if(userGroup === "user" || !isAuth){
			await bot.sendMessage(chatId, "У вас не прав!");
			return;
		}
		await bot.sendMessage(chatId, "Нажмите кнопку для добавления серийного номера", createKeyboard("Добавить серийный номер", "/serial-add"));
	}

  // Если пришел ответ от веб-приложения
  if (msg?.web_app_data?.data) {
    const data = JSON.parse(msg.web_app_data.data);
    // Получаем всех админов
    const adminUsers = await FbAdmin.getUsersDocsWhere("group", "admin");
    // Получение пользователя, который пытается авторизоваться
    const currentUser = await FbAdmin.getUserDoc(`${msg.chat?.id}`);
    const userGroup = currentUser ? currentUser.group : "user";
		// Если пришел серийный номер
		if(data.serialCode){
			await FbAdmin.addSerialCodeDoc(data.serialCode, data.country, data.diller);
			await bot.sendMessage(chatId, "Серийный номер добавлен!");
		}
		// Если пришел ответ от веб-приложения с данными пользователя
		else if (data.result){
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
		}
		// Если пришел ответ от веб-приложения с ошибкой
    else if (data.msg == "invalid_code") {
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
    } 
  }
});


// Express routes
app.post("/auth", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, application/json"
  );
  res.header("Content-Type", "application/json");
  const uid = req.body.uid;
  let userGroup = "user";
  let tgId = "";
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

// app.post("/serial-add", async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, application/json"
//   );

//   const serialCode = req.body.serialCode;
//   const country = req.body.country;
//   const diller = req.body.diller;

//   await FbAdmin.addSerialCode(serialCode, country, diller);

//   res.end("ok");
// });

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
