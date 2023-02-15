import { doc, updateDoc } from 'firebase/firestore';
import { FC } from 'react';
import { Button } from '../../../../components/UI/button/Button';
import { Input } from '../../../../components/UI/input/Input';
import { auth, db } from '../../../../firebase';
import cl from './ProfileModal.module.scss';

interface ProfileProps {
	visible: boolean,
	setVisible: (arg: boolean) => void
}

export const ProfileModal: FC<ProfileProps> = ({ visible, setVisible, }) => {
	const rootClasses = [cl.modal]
	if (visible) {
		rootClasses.push(cl.active)
	}

	const handleFormChange = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		e.stopPropagation()

		const birth = (e.currentTarget[0] as HTMLInputElement).value
		const langs = (e.currentTarget[1] as HTMLInputElement).value
		const city = (e.currentTarget[2] as HTMLInputElement).value

		const usersRef = doc(db, "users", auth.currentUser!.uid);
		await updateDoc(usersRef, {
			dateOfBirth: birth,
			languages: langs,
			city
		});
	}


	return (
		<div
			onClick={() => setVisible(false)} className={rootClasses.join(' ')}>
			<form onClick={(e) => handleFormChange(e)} className={cl.modalContent}>
				<Input

					placeholder='Enter your date of birth' />
				<Input

					placeholder='Enter your languages' />
				<Input

					placeholder='Enter your city' />
				<Button onClick={() => setVisible(false)}>Save</Button>
			</form>
		</div>
	)
}
