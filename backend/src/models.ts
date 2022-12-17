export type userGroup = "user" | "personal" | "admin";
export type case1Flag = "VZLOM" | "VYDACHA";
export interface FbUser {
	uid: string;
	phone: string;
	email: string;
	chatId: number;
	tgUsername: string;
	group: userGroup;
}

export interface FbCase1 {
	flag: case1Flag;
	str: number;
	date: string;
  username: string;
	group: userGroup;
}

export interface WebAppData {
  result: {
    user: {
      uid: string;
      emailVerified: boolean;
      isAnonymous: boolean;
      phoneNumber: string;
      createdAt: string;
      lastLoginAt: string;
      apiKey: string;
      appName: string;
    };
    providerId: string;
    _tokenResponse: {
      idToken: string;
      refreshToken: string;
      expiresIn: string;
      localId: string;
      isNewUser: boolean;
      phoneNumber: string;
    };
    operationType: string;
  };
  email: string;
}

export interface FbSerialCode {
	code: string;
	country: string;
	diller: string;
	date: string;
}

export interface FbMessage {
	text: string;
	date?: string;
	from: string;
	to: string;
}