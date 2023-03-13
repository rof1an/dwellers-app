import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { auth, db, storage } from '../firebase'

interface Params {
	email: string
	password: string
	file: File
	displayName: string
	setError: (arg: boolean) => void
}

export const useCreateUser = async (params: Params) => {
	const { email, password, file, displayName, setError } = params

	let defaultImgUrl = "https://winnote.ru/wp-content/uploads/2016/01/1454222417_del_recent_avatar1.png"

	//Create user
	const res = await createUserWithEmailAndPassword(auth, email, password)
	const date = new Date().getTime()
	const storageRef = ref(storage, `${displayName + date}`)

	// Upload profile image and update profile
	try {
		let downloadURL = defaultImgUrl

		if (file) {
			await uploadBytesResumable(storageRef, file)
			downloadURL = await getDownloadURL(storageRef)
		}

		await updateProfile(res.user, {
			displayName,
			photoURL: downloadURL,
		})

		// Create user on firestore
		await setDoc(doc(db, 'users', res.user.uid), {
			uid: res.user.uid,
			displayName,
			email,
			photoURL: downloadURL,
		})

		// Create empty chats collection
		await setDoc(doc(db, 'userChats', res.user.uid), {})
	} catch (err) {
		setError(true)
	}
}

