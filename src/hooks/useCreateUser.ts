import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, db, storage } from '../firebase';


interface Params {
	email: string,
	password: string,
	file: File,
	displayName: string,
	setError: (arg: boolean) => void
}

export const useCreateUser = async (params: Params) => {
	const { email, password, file, displayName, setError } = params


	//Create user
	const res = await createUserWithEmailAndPassword(auth, email, password);

	const date = new Date().getTime();
	const storageRef = ref(storage, `${displayName + date}`);

	await uploadBytesResumable(storageRef, file).then(() => {
		getDownloadURL(storageRef).then(async (downloadURL) => {
			try {
				//Update profile
				await updateProfile(res.user, {
					displayName,
					photoURL: downloadURL,
				});

				//create user on firestore
				await setDoc(doc(db, "users", res.user.uid), {
					uid: res.user.uid,
					displayName,
					email,
					photoURL: downloadURL,
				});

				// create empty chats collection
				await setDoc(doc(db, "userChats", res.user.uid), {})

			} catch (err) {
				setError(true);
			}
		});
	});
}