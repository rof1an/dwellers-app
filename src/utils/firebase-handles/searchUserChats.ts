import { User } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { FindUserData } from '../../@types/chat-types'
import { db } from '../../firebase'


interface SearchProps {
	combinedId: string,
	findUser: FindUserData | null,
	currentUser: User
}

export const searchUserChats = async ({ combinedId, findUser, currentUser }: SearchProps) => {
	await getDoc(doc(db, 'chats', combinedId)).then(async (res) => {
		if (!res.exists()) {
			// await setDoc(doc(db, 'chats', combinedId), { messages: [] })

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