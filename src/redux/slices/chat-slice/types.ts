
export type UserInfo = {
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
	currentUser: UserInfo | null,
	clickedUser: UserInfo | null,
	lastSender: LastSender | null
}