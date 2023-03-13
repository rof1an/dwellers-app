import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { v4 as uuid } from 'uuid'
import { db, storage } from '../firebase'

export const useHandleSend = async ({ img, data, text }: any) => {
	if (img) {
		const storageRef = ref(storage, uuid())
		const uploadTaskSnapshot = await uploadBytesResumable(storageRef, img)
		const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref)

		await updateDoc(doc(db, 'chats', data.chatId), {
			messages: arrayUnion({
				id: uuid(),
				text,
				senderId: data.currentUser.uid,
				date: Timestamp.now(),
				img: downloadURL,
			}),
		})
	} else {
		updateDoc(doc(db, 'chats', data.chatId), {
			messages: arrayUnion({
				id: uuid(),
				text,
				senderId: data.currentUser!.uid,
				date: Timestamp.now(),
			}),
		})
	}

	await updateDoc(doc(db, "userChats", data.currentUser!.uid), {
		[data.chatId + '.lastMessage']: {
			text
		},
		[data.chatId + '.date']: serverTimestamp(),
	})
	await updateDoc(doc(db, "userChats", data.clickedUser?.uid), {
		[data.chatId + '.lastMessage']: {
			text
		},
		[data.chatId + '.date']: serverTimestamp(),
	})
}