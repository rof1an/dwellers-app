import { User } from 'firebase/auth'

export type AccountData = {
	accountCity: {
		value: string,
		label: string
	},
	languages: {
		label: string
		value: string
	}[],
	dateOfBirth: string
}

export interface AuthState {
	isAuth: boolean
	currentUser: User | null
	isLoading: boolean
	error: string | null | undefined
	status: string,
	accountData: AccountData
}

export interface CurrUser {
	accessToken: string
	metadata: {
		createdAt: string
		lastLoginAt: string
	}
	displayName: string
	email: string
	emailVerified: boolean,
	isAnonymous: boolean
	phoneNumber: string | null
	photoURL: string
	providerData: Array<{
		providerId: string
		uid: string
		displayName: string
		email: string
		phoneNumber: string | null
		photoURL: string
	}>
	providerId: string
	uid: string
	stsTokenManager: {
		accessToken: string
		apiKey: string
		expirationTime: number
		refreshToken: string
		tokenType: string
	}
}