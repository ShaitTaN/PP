import { createClient } from "redis";
import { REDIS_URL } from "./config";

export const redisClient = createClient();

export enum collections {
  USERS = "users",
  SERIAL_CODES = "serialCodes",
  MESSAGES = "messages",
  LOGS = "logs",
}

export const setHash = (key: string, field: string | number, value: string) => {
  redisClient.hSet(key, field, value);
};

export const getHash = (key: string, field: string) => {
  return redisClient.hGet(key, field);
};

export const createUser = (tgUserId: string, username: string) => {
  const newUser = {
    uid: tgUserId,
    username,
    group: "user",
  };

  setHash(collections.USERS, newUser.uid, JSON.stringify(newUser));
};

export const addJson = (
  uid: string,
  filename: string,
  jsonText: string,
  fileId: string,
  expire?: number | undefined
) => {
  const newJsonDoc = {
    uid,
    filename,
    text: jsonText,
    fileId,
    date: new Date(),
  };

  redisClient.set(`${uid}:${filename}`, JSON.stringify(newJsonDoc));

  if (expire) {
    redisClient.expire(`${uid}:${filename}`, expire);
  }
};

export async function getKeys(pattern = "*", count = 10) {
  const results = [];
  const iteratorParams = {
    MATCH: pattern,
    COUNT: count,
  };
  for await (const key of redisClient.scanIterator(iteratorParams)) {
    results.push(key);
  }
  return results;
}

export const getKey = (key: string) => {
  return redisClient.get(key);
};

export const addSortedSet = (key: string, members: any[]) => {
  console.log(key, members);
  redisClient.zAdd(key, members);
};

export const addSerialCode = async (
  code: string,
  country: string,
  diller: string
) => {
  const newSerialCodeDoc = {
    code,
    country,
    diller,
    date: new Date(),
  };

  setHash(collections.SERIAL_CODES, code, JSON.stringify(newSerialCodeDoc));
};

export const addMessage = (message: any) => {
  const newMessage: {
    text: string;
    date?: string | number;
    from: string;
    to: string;
  } = {
    text: message.text,
    date: Date.now(),
    from: message.from,
    to: message.to,
  };

  setHash(collections.MESSAGES, Date.now(), JSON.stringify(newMessage));
};
