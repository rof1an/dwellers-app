import { UserInfo } from '../redux/slices/chat-slice/types'

export type LastMsg = {
	text: string
}
export interface ChatsProps {
	date: number,
	userInfo: UserInfo,
	lastMessage: LastMsg
}

export interface IMessage {
	date: {
		nanoseconds: number,
		seconds: number
	},
	id: string,
	senderId: string,
	text: string,
	img?: string
}


export interface FindUserData {
	uid: string
	displayName: string
	photoURL: string
}
