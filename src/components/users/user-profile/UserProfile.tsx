import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileData } from '../../../@types/home-types'
import addFriendSvg from '../../../assets/addFriend.png'
import sendMessageSvg from '../../../assets/send-mail-2574.svg'
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
	const [data, setData] = useState<ProfileData>({
		city: { label: '', value: '' }, date: '', languages: [],
	})
	const [isLoading, setIsLoading] = useState(false)
	const { selectedUser } = useAppSelector(state => state.users)
	const { currentUser } = useAppSelector(state => state.auth)

	React.useEffect(() => {
		if (selectedUser?.uid) {
			const getData = onSnapshot(doc(db, 'users', selectedUser.uid), (doc) => {
				setIsLoading(true)
				setData((prevData) => ({ ...prevData, ...doc.data() }))
				setIsLoading(false)
			})
			return () => getData()
		}
	}, [selectedUser?.uid])

	const openChatWithUser = async () => {
		const combinedId = getBothUid.getUid(currentUser!.uid, selectedUser!.uid)
		const docRef = doc(db, 'chats', combinedId)
		const docSnap = await getDoc(docRef)

		dispatch(setChatInfo(selectedUser as TUserInfo))
		dispatch(setCurrentUser(currentUser as TUserInfo))

		if (!docSnap.exists()) {
			await setDoc(doc(db, 'chats', combinedId), { messages: [] })
		}
		navigate('/chats')
	}

	return (
		<>
			{isLoading && <Loader />}
			<div className={cl.mainInfo}>
				<div className={cl.avatar}>
					{selectedUser?.photoURL && <img className={cl.mainImg} src={selectedUser.photoURL} />}
				</div>
				<div className={cl.mainAbout}>
					<h2 className={cl.profileTitle}>{selectedUser?.displayName}</h2>
					<hr />
					<div className={cl.subBlock}>
						<h3 className={cl.subtitle}>
							<p>Frontend developer</p>
						</h3>
						<div className={cl.interaction}>
							<span>
								<p>add to friends</p>
								<img src={addFriendSvg} alt="" />
							</span>
							<span onClick={openChatWithUser}>
								<p>Send a message</p>
								<img className={cl.invertSvg} src={sendMessageSvg} alt="" />
							</span>
						</div>
					</div>
					<div className={cl.profileInfo}>
						<div className={cl.left}>
							<p>Date of birth:</p>
							<p>Languages:</p>
							<p>City:</p>
						</div>
						<div className={cl.right}>
							<p className={cl.rightInfo}>{data.date ? data.date : <span>none</span>}</p>
							<p className={cl.rightInfo}>{data.languages.length > 0 ? data.languages.map((l) => l.label).join(', ') : <span>none</span>}</p>
							<p className={cl.rightInfo}>{data.city.label ? data.city.label : <span>none</span>}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
