import { ChatsProps } from '../../../@types/chat-types'

export type TUserInfo = {
	displayName: string,
	photoURL: string,
	uid: string,
}

export type LastSender = {
	date: { seconds: number, nanoseconds: number },
	id: string,
	senderId: string,
	text: string
}

export interface ChatState {
	chatId: string,
	currentUser: TUserInfo | null,
	clickedUser: TUserInfo | null,
	lastSender: LastSender | null,
}