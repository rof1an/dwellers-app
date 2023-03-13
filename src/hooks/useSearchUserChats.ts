import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { FindUserData } from '../components/Pages-components/chat/ChatSearch'


interface SearchProps {
	combinedId: string,
	findUser: FindUserData | null,
	currentUser: any
}

export const useSearchUserChats = async ({ combinedId, findUser, currentUser }: SearchProps) => {

	await getDoc(doc(db, 'chats', combinedId)).then(async (res) => {
		if (!res.exists()) {
			await setDoc(doc(db, 'chats', combinedId), { messages: [] })

			await updateDoc(doc(db, 'userChats', currentUser.uid), {
				[combinedId + '.userInfo']: {
					uid: findUser?.uid,
					displayName: findUser?.displayName,
					photoUrl: findUser?.photoURL
				},
				[combinedId + '.date']: serverTimestamp(),
			})

			await updateDoc(doc(db, 'userChats', findUser!.uid), {
				[combinedId + '.userInfo']: {
					uid: currentUser?.uid,
					displayName: currentUser?.displayName,
					photoUrl: currentUser?.photoURL
				},
				[combinedId + '.date']: serverTimestamp(),
			})
		}
	})
}