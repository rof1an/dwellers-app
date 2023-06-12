import { SetStateAction } from 'react'

export type TPost = {
	id: string
	postText: string
	likesCount: number
	dateId: number
	postId: string
	userId: string,
	imgUrl: string
}

export interface PostProps {
	deletePost: (arg: string) => void,
	timeAgo: string,
	post: TPost,
}

export type Lang = {
	label: string,
	value: string,
}

export type ProfileData = {
	city: City,
	date: string,
	languages: Lang[],
	subtitle: string
}

export type ProfileUserData = {
	city: City,
	date: string,
	languages: Lang[],
}

export type ProfileModalData = {
	city: City,
	date: string,
	languages: Lang[],
}

export type City = {
	label: string,
	value: string,
}

export type ProfileValues = {
	city: City,
	date: string,
	languages: Lang[],
	subtitle?: string
}

export interface ProfileProps {
	visible: boolean
	data: ProfileValues
	setData: (arg: ProfileModalData) => void // Update the type here
	setVisible: (arg: boolean) => void
}

export type FormTypes = {
	languages: Lang[],
	city: City,
	date?: string,
}