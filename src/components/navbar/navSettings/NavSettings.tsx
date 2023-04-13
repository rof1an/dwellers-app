import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import cl from './NavSettings.module.scss'
import { Button } from '../../UI/button/Button'

interface INavSettings {
	isVisible: boolean,
	setIsVisible: (arg: boolean) => void
}

export const NavSettings = ({ isVisible, setIsVisible }: INavSettings) => {
	const [isClockActive, setIsClockActive] = useState(false)
	const { currentUser } = useAppSelector(state => state.auth)

	const activateClock = async () => {
		setIsClockActive(prevState => !prevState)
		if (currentUser?.uid) {
			await updateDoc(doc(db, 'userSettings', currentUser.uid), {
				clockActive: !isClockActive
			})
		}
	}

	const deleteAccount = () => {

	}

	useEffect(() => {
		const activeClock = () => {
			if (currentUser?.uid) {
				onSnapshot(doc(db, 'userSettings', currentUser.uid), (doc) => {
					setIsClockActive(doc.data()?.clockActive)
				})
			}
		}
		activeClock()
	}, [])

	return (
		<div
			onClick={() => setIsVisible(false)}
			className={isVisible ? `${cl.modal} ${cl.active}` : `${cl.modal}`}>
			<div
				onClick={(e) => e.stopPropagation()}
				className={cl.modalContent}>
				<h2>App settings</h2>
				<ul className={cl.contentList}>
					<li>
						<input onChange={activateClock} type="checkbox" />
						<label>Add a watch to the home page</label>
					</li>
					<li>
						<Button>Delete an account</Button>
					</li>
				</ul>
			</div>
		</div>
	)
}
