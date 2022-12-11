import TelegramBot from "node-telegram-bot-api";
import express, { Express, Request, Response } from "express";
const cors = require("cors");

const token = "5720047994:AAEJpGg3e9jmV1nBc2_tQEoFPNHW2vfSwL0";
const bot = new TelegramBot(token, { polling: true });
const webAppUrl = "https://remarkable-crostata-72b9ae.netlify.app";

const PORT = 3030;
const app: Express = express();
app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появится форма для авторизации", {
      reply_markup: {
        keyboard: [
          [{ text: "Заполнить форму", web_app: { url: webAppUrl + "/auth" } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    const data = JSON.parse(msg.web_app_data.data);
    console.log(data);
  }
});

app.post("/phone", (req: Request, res: Response) => {
  const { phone } = req.body;

  return res.status(200).json({});
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
