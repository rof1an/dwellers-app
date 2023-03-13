export type UserInfo = {
	displayName: string,
	photoUrl: string,
	uid: string
}

export interface ChatState {
	chatId: string,
	currentUser: UserInfo | null,
	clickedUser: UserInfo | null
}