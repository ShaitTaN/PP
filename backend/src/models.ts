export interface WebAppData {
		result: {
			user: {
				uid: string,
				emailVerified: boolean,
				isAnonymous: boolean,
				phoneNumber: string,
				createdAt: string,
				lastLoginAt: string,
				apiKey: string,
				appName: string
			},
			providerId: string,
			_tokenResponse: {
				idToken: string,
				refreshToken: string,
				expiresIn: string,
				localId: string,
				isNewUser: boolean,
				phoneNumber: string
			},
			operationType: string
		},
		email: string
}