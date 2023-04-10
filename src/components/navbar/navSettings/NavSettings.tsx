import { doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import cl from './NavSettings.module.scss'

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
				</ul>
			</div>
		</div>
	)
}
