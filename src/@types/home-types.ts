export type TPost = {
	id: string
	postText: string
	likesCount: number
	dateId: number
	postId: string
}

export interface PostProps {
	deletePost: (arg: string) => void
	timeAgo: string
	post: TPost
}

export type ProfileData = {
	city: City
	date: string
	languages: {
		label: string
		value: string
	}[]
}

export type City = {
	label: string,
	value: string
}

export type Lang = {
	label: string,
	value: string
}

export type ProfileValues = {
	city: City
	date: string
	languages: Lang[]
}

export interface ProfileProps {
	visible: boolean
	value: ProfileValues
	setValue: (arg: ProfileValues) => void
	setVisible: (arg: boolean) => void
}

export type HandleSubmitForm = {
	languages: Lang[],
	city: City,
	date?: string,
}