import { TUserInfo } from '../redux/slices/chat-slice/types'

export type LastMsg = {
	text: string
}
export interface ChatsProps {
	date: {
		seconds: number,
		nanoseconds: number
	},
	userInfo: TUserInfo,
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
