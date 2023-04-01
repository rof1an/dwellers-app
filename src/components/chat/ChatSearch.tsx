import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useCallback, useState } from 'react'
import { FindUserData } from '../../@types/chat-types'
import closeSvg from '../../assets/close-boxed-svgrepo-com.svg'
import { Input } from '../../components/UI/input/Input'
import { db } from '../../firebase'
import { useAppSelector } from '../../hooks/hooks'
import cl from '../../pages/chats/Chats.module.scss'
import { searchUserChats } from '../../utils/firebase-handles/searchUserChats'
import { getBothUid } from '../../utils/getBothUid'

export const ChatSearch = () => {
	const [findUser, setFindUser] = useState<FindUserData | null>(null)
	const [findUserName, setFindUserName] = useState('')
	const { currentUser } = useAppSelector((state) => state.auth)

	const handleSearch = useCallback(async () => {
		const q = query(collection(db, 'users'), where('displayName', '==', findUserName))
		const querySnapshot = await getDocs(q)
		querySnapshot.forEach((doc) => {
			setFindUser(doc.data() as FindUserData)
		})
	}, [findUserName])

	React.useEffect(() => {
		if (findUserName.trim() === '') {
			setFindUser(null)
		} else {
			handleSearch()
		}
	}, [findUserName])

	const handleSelect = useCallback(async () => {
		if (!findUser || !currentUser) return

		const combinedId = getBothUid.getUid(currentUser.uid, findUser.uid)
		await searchUserChats({ combinedId, findUser, currentUser })
		setFindUser(null)
		setFindUserName('')
	}, [currentUser, findUser])

	return (
		<div className={cl.searchUser}>
			<div className={cl.inputBlock}>
				<Input
					value={findUserName}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFindUserName(e.target.value)}
					placeholder="Search a user.."
				/>
				{findUserName &&
					<img onClick={() => setFindUserName('')} className={cl.deleteValue} src={closeSvg} alt="" />}
			</div>
			<ul className={cl.users}>
				{findUser && (
					<li onClick={handleSelect} className={cl.chatSearched}>
						<img src={findUser.photoURL} alt="" />
						<span>{findUser.displayName}</span>
					</li>
				)}
			</ul>
		</div>
	)
}
