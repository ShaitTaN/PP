import TelegramBot from "node-telegram-bot-api";
import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import type {
  case1Flag,
  WebAppData,
  FbUser,
  FbCase1,
  FbSerialCode,
  FbMessage,
  FbJson,
  FbLog,
} from "./models";
const serviceAccount = require("../fbServiceAccountKey.json");

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
const serialCodesDocRef = db.collection("serialCodes");
const messagesDocRef = db.collection("messages");
const jsonDocRef = db.collection("json");
const logsDocRef = db.collection("logs");

// Firebase functions
const getUserDoc = async (tgUserId: string) => {
  const userDoc = await usersDocRef.doc(tgUserId).get();
  if (!userDoc.exists) return null;
  return userDoc.data();
};

const getUsersDocsWhere = async <T>(condition: string, value: T) => {
  const snapshot = await usersDocRef.where(condition, "==", value).get();
  if (snapshot.empty) return null;
  return snapshot;
};

const addCase1Doc = async (flag: case1Flag, msg: TelegramBot.Message) => {
  const userDoc = await getUserDoc(`${msg.chat?.id}`);

  const newCase1Doc: FbCase1 = {
    str: Math.cos(Math.random()),
    date: Timestamp.now()
      .toDate()
      .toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }),
    username: msg.chat.username!,
    flag: flag,
    group: userDoc?.group || "user",
  };

  case1DocRef.add(newCase1Doc);
};

const addUserDoc = async (
  tgUserId: string,
  msg: TelegramBot.Message,
  data: WebAppData
) => {
  const userDoc = await getUserDoc(`${msg.chat?.id}`);
  if (userDoc) return;

  const newUserDoc: FbUser = {
    uid: data.result.user.uid,
    phone: data.result.user.phoneNumber,
    email: data.email,
    chatId: msg.chat.id,
    tgUsername: msg.chat.username!,
    group: "user",
  };

  usersDocRef.doc(tgUserId).set(newUserDoc);
};

const getSerialCodeDoc = async (code: string) => {
  const serialCodeDoc = await serialCodesDocRef.doc(code).get();
  if (!serialCodeDoc.exists) return null;
  return serialCodeDoc.data();
};

const addSerialCodeDoc = async (
  code: string,
  country: string,
  diller: string
) => {
  const newSerialCodeDoc: FbSerialCode = {
    code,
    country,
    diller,
    date: Timestamp.now()
      .toDate()
      .toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }),
  };

  serialCodesDocRef.doc(code).set(newSerialCodeDoc);
};

const addMessageDoc = async (message: FbMessage) => {
  const newMessageDoc: FbMessage = {
    text: message.text,
    date: Timestamp.now()
      .toDate()
      .toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }),
    from: message.from,
    to: message.to,
  };
  messagesDocRef.add(newMessageDoc);
};

const findJsonDocsWhere = async (condition: string, value: string) => {
  const snapshot = await jsonDocRef.where(condition, "==", value).get();
  if (snapshot.empty) return null;
  return snapshot;
};

const addJsonDoc = async (uid: string, name: string, jsonText: string, fileId: string) => {
  const newJsonDoc: FbJson = {
    uid,
    name,
    text: jsonText,
		fileId,
    date: Timestamp.now()
      .toDate()
      .toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }),
    timestamp: Timestamp.now(),
  };

  jsonDocRef.doc(`${uid} - ${name}`).set(newJsonDoc);
};

const addLogDoc = async (chatId: string, text: string) => {
  const newLogDoc: FbLog = {
    uid: chatId,
    text,
    date: Timestamp.now()
      .toDate()
      .toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }),
    timestamp: Timestamp.now(),
  };

	logsDocRef.add(newLogDoc);
};

export const FbAdmin = {
  getUserDoc,
  getUsersDocsWhere,
  addCase1Doc,
  addUserDoc,
  getSerialCodeDoc,
  addSerialCodeDoc,
  addMessageDoc,
  addJsonDoc,
  findJsonDocsWhere,
	addLogDoc
};
