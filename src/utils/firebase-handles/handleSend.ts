import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { v4 as uuid } from 'uuid'
import { db, storage } from '../../firebase'
import { UserInfo } from '../../redux/slices/chat-slice/types'

export interface HandleSendProps {
	img: File | null,
	text: string,
	data: {
		chatId: string,
		currentUser: UserInfo | null,
		clickedUser: UserInfo | null
	},
	lastSenderId: string
}


export const handleSend = async ({ img, data, text, lastSenderId }: HandleSendProps) => {
	const storageRef = ref(storage, uuid())


	if (img && text.length > 0) {
		const uploadTaskSnapshot = await uploadBytesResumable(storageRef, img)
		const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref)

		await updateDoc(doc(db, 'chats', data.chatId), {
			messages: arrayUnion({
				id: uuid(),
				text,
				senderId: data?.currentUser?.uid,
				date: Timestamp.now(),
				img: downloadURL,
			}),
		})
	} else if (text.length > 0) {
		await updateDoc(doc(db, 'chats', data.chatId), {
			messages: arrayUnion({
				id: uuid(),
				text,
				senderId: data.currentUser!.uid,
				date: Timestamp.now(),
			}),
		})
	} else if (img) {
		const uploadTaskSnapshot = await uploadBytesResumable(storageRef, img)
		const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref)

		await updateDoc(doc(db, 'chats', data.chatId), {
			messages: arrayUnion({
				id: uuid(),
				img: downloadURL,
				senderId: data.currentUser!.uid,
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

	await updateDoc(doc(db, 'userChats', data.currentUser!.uid), {
		[data.chatId + '.sender']: {
			senderId: lastSenderId
		}
	})
}
