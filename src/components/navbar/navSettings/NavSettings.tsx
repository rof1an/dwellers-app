import { deleteUser, signOut } from 'firebase/auth'
import { deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import deleteImg from '../../../assets/close-boxed-svgrepo-com.svg'
import clockSvg from '../../../assets/icons8-часы.svg'
import { auth, db } from '../../../firebase'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { setAuth } from '../../../redux/slices/auth-slice/authSlice'
import cl from './NavSettings.module.scss'

interface INavSettings {
	isVisible: boolean,
	setIsVisible: (arg: boolean) => void
}

export const NavSettings = ({ isVisible, setIsVisible }: INavSettings) => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
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
	console.log(currentUser && true)

	const deleteAccount = async () => {
		try {
			if (currentUser) {
				await deleteDoc(doc(db, "users", currentUser.uid))
				await deleteDoc(doc(db, "userSettings", currentUser.uid))
				await deleteDoc(doc(db, "userPosts", currentUser.uid))
				await deleteDoc(doc(db, "userChats", currentUser.uid))
				await deleteDoc(doc(db, "friendsRequests", currentUser.uid))
				await signOut(auth).then(() => {
					dispatch(setAuth(false))
					localStorage.removeItem('persist:root')
					setIsVisible(false)
					navigate('/')
				})
				await deleteUser(currentUser)
			}
		} catch (error) {
			console.error(error)
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

					<li className={cl.item}>
						<div className={cl.itemSeperator}>
							<img className={cl.itemImg} src={clockSvg} alt="" />
							<div>
								<span>Add a clock</span>
								<p>Turn on the clock display near the navigation bar</p>
							</div>
						</div>
						<span
							onClick={activateClock}
							className={cl.itemSwitcher}>{isClockActive ? 'Enabled' : 'Disabled'}</span>
					</li>
					<hr />

					<li className={cl.item}>
						<div className={cl.itemSeperator}>
							<img className={cl.itemImg} src={deleteImg} alt="" />
							<div>
								<span>Delete an account</span>
								<p>Completely delete the account and all data</p>
							</div>
						</div>
						<span
							onClick={deleteAccount}
							className={cl.itemSwitcher}>Delete</span>
					</li>
					<hr />

				</ul>
			</div>
		</div>
	)
}
