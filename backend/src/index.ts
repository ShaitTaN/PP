import TelegramBot from "node-telegram-bot-api";
import express, { Express, Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
// import {Timestamp} from 'firebase-admin/firestore'
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

const docRef = db.collection("authenthifications").doc("alovelace");

docRef.set({
  first: "Ada",
  last: "Lovelace",
  born: 1815,
});



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

  if (msg?.web_app_data?.data) {
    const data = JSON.parse(msg.web_app_data.data);
    // const user = data?.result?.user;
    // const z = {
    //   uid: user.uid,
    //   phone: user.phoneNumber,
    //   email: data.email,
    //   chatId: chatId,
		// 	tgUsername: msg.chat.username,
		// 	date: Timestamp.now().toDate().toUTCString()
    // };
    // await bot.sendMessage(chatId, `${msg.chat.username} вы авторизованы`);
    console.log(data);
  }
});

// Express routes
app.post("/auth", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({
    message: "Auth ok! Your ip: " + req.ip,
  });
  res.end();
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
