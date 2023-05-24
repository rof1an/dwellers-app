import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import defaultAvatar from '../../../src/assets/defaultAvatar.png'
import { auth, db, storage } from '../../firebase'

interface IParams {
	email: string,
	password: string,
	img?: File | null,
	displayName: string,
	setError: (arg: boolean) => void
}

export const createUser = async (params: IParams) => {
	const { email, password, img, displayName, setError } = params

	const defaultImgResponse = await fetch(defaultAvatar)
	const defaultImgBlob = await defaultImgResponse.blob()

	//Create user
	const res = await createUserWithEmailAndPassword(auth, email, password)
	const storageRef = ref(storage, `${'avatar'}-${email}`)

	// Upload profile image and update profile
	try {
		let downloadURL = defaultAvatar
		if (img) {
			await uploadBytesResumable(storageRef, img)
			downloadURL = await getDownloadURL(storageRef)
		} else {
			await uploadBytesResumable(storageRef, defaultImgBlob)
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
		await setDoc(doc(db, 'userSettings', res.user.uid), {
			clockActive: false
		})
	} catch (err) {
		setError(true)
	}
}