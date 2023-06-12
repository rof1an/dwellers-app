import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileUserData } from '../../../@types/home-types'
import { db } from '../../../firebase'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { setChatInfo, setCurrentUser } from '../../../redux/slices/chat-slice/chatSlice'
import { TUserInfo } from '../../../redux/slices/chat-slice/types'
import { getBothUid } from '../../../utils/getBothUid'
import { Loader } from '../../UI/loader/Loader'
import cl from './UserProfile.module.scss'

export const UserProfile = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [data, setData] = useState<ProfileUserData>({
		city: { label: '', value: '' }, date: '', languages: [],
	})
	const [isLoading, setIsLoading] = useState(false)
	const { selectedUser } = useAppSelector(state => state.users)
	const { currentUser } = useAppSelector(state => state.auth)

	useEffect(() => {
		if (selectedUser?.uid) {
			const getData = onSnapshot(doc(db, 'users', selectedUser.uid), (doc) => {
				setIsLoading(true)
				setData((prevData) => ({ ...prevData, ...doc.data() }))
				setIsLoading(false)
			})
			dispatch(setCurrentUser(currentUser as TUserInfo))

			return () => getData()
		}
	}, [selectedUser?.uid])


	const openChatWithUser = async () => {
		const combinedId = getBothUid.getUid(currentUser!.uid, selectedUser!.uid)
		const docRef = doc(db, 'chats', combinedId)
		const docSnap = await getDoc(docRef)

		dispatch(setChatInfo(selectedUser as TUserInfo))

		if (!docSnap.exists()) {
			await setDoc(doc(db, 'chats', combinedId), { messages: [] })

			await updateDoc(doc(db, 'userChats', currentUser!.uid), {
				[combinedId + '.userInfo']: {
					uid: selectedUser?.uid,
					displayName: selectedUser?.displayName,
					photoURL: selectedUser?.photoURL
				},
				[combinedId + '.date']: serverTimestamp(),
			})

			await updateDoc(doc(db, 'userChats', selectedUser!.uid), {
				[combinedId + '.userInfo']: {
					uid: currentUser?.uid,
					displayName: currentUser?.displayName,
					photoURL: currentUser?.photoURL
				},
				[combinedId + '.date']: serverTimestamp(),
			})
		}

		navigate('/chats')
	}


	return (
		<>
			{isLoading && <Loader />}
			<div className={cl.root}>
				<div className={cl.emptyShadow}></div>
				<div className={cl.mainInfo}>
					<div className={cl.avatar}>
						{selectedUser?.photoURL && <img className={cl.mainImg} src={selectedUser.photoURL} />}
					</div>
					<div className={cl.mainAbout}>
						<div className={cl.nameBlock}>
							<h2 className={cl.profileTitle}>{selectedUser?.displayName}</h2>
						</div>
						<div className={cl.subBlock}>
							<span className={cl.subtitle}>
								<p>Frontend developer</p>
							</span>
							<div className={cl.btns}>
								<div className={cl.moreBtn}>
								</div>
							</div>

						</div>
						<div className={cl.profileInfo}>
							<div>
								<p>Date of birth:</p>
								<p>{data?.date ? data.date : <span className={cl.emptyInfo}>none</span>}</p>
							</div>
							<div>
								<p>City:</p>
								<p>{data?.city?.label ? data.city.label : <span className={cl.emptyInfo}>none</span>}</p>
							</div>
							<div>
								<p>Languages:</p>
								<p>{data?.languages?.length > 0 ? data.languages.map((l) => l.label).join(', ') : <span className={cl.emptyInfo}>none</span>}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
