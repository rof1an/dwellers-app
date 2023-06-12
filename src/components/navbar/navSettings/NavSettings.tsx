import { deleteUser, signOut } from 'firebase/auth'
import { deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clockSvg from '../../../assets/icons8-часы.svg'
import { auth, db } from '../../../firebase'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { setAuth } from '../../../redux/slices/auth-slice/authSlice'
import cl from './NavSettings.module.scss'
import { SettingsItem } from './settingsItem/SettingsItem'

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
					<SettingsItem
						title='Add a clock'
						subtitle='Turn on the clock display near the navigation bar'
						switcherTitle={{ enabled: 'Enabled', disabled: 'Disabled' }}
						setSetting={activateClock}
						isDone={isClockActive}
						imgSrc={clockSvg}
					/>
				</ul>
			</div>
		</div>
	)
}
