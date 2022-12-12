import TelegramBot from "node-telegram-bot-api";
import express, { Express, Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
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

// Bot logic
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    console.log(msg);
    await bot.sendMessage(chatId, "Нажмите кнопку для авторизации", {
      reply_markup: {
        keyboard: [
          [{ text: "Авторизация", web_app: { url: webAppUrl + "/auth" } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    const data = JSON.parse(msg.web_app_data.data);
    console.log(data.user);
    await bot.sendMessage(chatId, `${msg.from?.username} вы авторизованы`);
    await bot.sendMessage(chatId, `user - ${JSON.stringify(data.user)}`);
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
