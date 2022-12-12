import TelegramBot from "node-telegram-bot-api";
import express, { Express, Request, Response } from "express";
// import { query, where, collection, addDoc, getDoc } from "firebase/firestore"; 
import { db, auth } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const cors = require("cors");

const token = "5720047994:AAEJpGg3e9jmV1nBc2_tQEoFPNHW2vfSwL0";
const bot = new TelegramBot(token, { polling: true });
const webAppUrl = "https://remarkable-crostata-72b9ae.netlify.app";

const PORT = 3030;
const app: Express = express();
let isAuthorized = false
// Middleware
function checkAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (isAuthorized) {
    next()
  } else {
    res.status(403).send('Unauthorized!')
    return
  }
}
app.use(express.json());
app.use(cors());
app.use('/', checkAuth)

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
		console.log(msg)
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
		await bot.sendMessage(chatId, `${msg.from?.username} вы авторизованы`)
		await bot.sendMessage(chatId, `user - ${JSON.stringify(data.user)}` )
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  })
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});