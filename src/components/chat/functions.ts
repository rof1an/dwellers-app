import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { v4 as uuid } from 'uuid'
import { db, storage } from '../../firebase'
import { LastSender, TUserInfo } from '../../redux/slices/chat-slice/types'
import { User } from 'firebase/auth'
import { getDoc } from 'firebase/firestore'
import { FindUserData } from '../../@types/chat-types'


interface SearchProps {
	combinedId: string,
	findUser: FindUserData | null,
	currentUser: User
}


export interface HandleSendProps {
	img: File | null,
	text: string,
	data: {
		chatId: string,
		currentUser: TUserInfo | null,
		clickedUser: TUserInfo | null
	},
	lastSender: LastSender | null
}

export const handleSend = async ({ img, data, text, lastSender }: HandleSendProps) => {
	const storageRef = ref(storage, uuid())

	if (img && text.length > 0) {
		const uploadTaskSnapshot = await uploadBytesResumable(storageRef, img)
		const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref)

		await updateDoc(doc(db, 'chats', data.chatId), {
			messages: arrayUnion({
				id: data.chatId,
				text,
				senderId: data?.currentUser?.uid,
				date: Timestamp.now(),
				img: downloadURL,
			}),
		})
	} else if (text.length > 0) {
		await updateDoc(doc(db, 'chats', data.chatId), {
			messages: arrayUnion({
				id: data.chatId,
				text,
				senderId: data?.currentUser!.uid,
				date: Timestamp.now(),
			}),
		})
	} else if (img) {
		const uploadTaskSnapshot = await uploadBytesResumable(storageRef, img)
		const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref)

		await updateDoc(doc(db, 'chats', data.chatId), {
			messages: arrayUnion({
				id: data.chatId,
				img: downloadURL,
				senderId: data?.currentUser!.uid,
				date: Timestamp.now(),
			}),
		})
	}

	await updateDoc(doc(db, "userChats", data.currentUser!.uid), {
		[data.chatId + '.lastMessage']: {
			text: text || '...',
		},
		[data.chatId + '.date']: serverTimestamp(),
	})

	await updateDoc(doc(db, "userChats", data.clickedUser!.uid), {
		[data.chatId + '.lastMessage']: {
			text: text || '...',
		},
		[data.chatId + '.date']: serverTimestamp(),
	})
}


export const searchUserChats = async ({ combinedId, findUser, currentUser }: SearchProps) => {
	await getDoc(doc(db, 'chats', combinedId)).then(async (res) => {
		if (!res.exists()) {
			await updateDoc(doc(db, 'userChats', currentUser.uid), {
				[combinedId + '.userInfo']: {
					uid: findUser?.uid,
					displayName: findUser?.displayName,
					photoURL: findUser?.photoURL
				},
				[combinedId + '.date']: serverTimestamp(),
			})

			await updateDoc(doc(db, 'userChats', findUser!.uid), {
				[combinedId + '.userInfo']: {
					uid: currentUser?.uid,
					displayName: currentUser?.displayName,
					photoURL: currentUser?.photoURL
				},
				[combinedId + '.date']: serverTimestamp(),
			})
		}
	})
}