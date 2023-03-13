import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { FC, useState } from 'react'
import cl from '../../../components/Pages/chats/Chats.module.scss'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import { useSearchUserChats } from '../../../hooks/useSearchUserChats'
import { Input } from '../../UI/input/Input'

export interface FindUserData {
	[key: string]: string
}

export const ChatSearch = () => {
	const [findUser, setFindUser] = useState<FindUserData | null>(null)
	const [findUserName, setFindUserName] = useState('')
	const { currentUser } = useAppSelector(state => state.auth)

	const handleSearch = async () => {
		const q = query(collection(db, "users"), where("displayName", "==", findUserName))
		const querySnapshot = await getDocs(q)
		querySnapshot.forEach((doc) => {
			setFindUser(doc.data() as FindUserData)
		})
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		e.code == 'Enter' && handleSearch()
	}

	const useHandleSelect = async () => {
		const combinedId = currentUser.uid > findUser!.uid
			? currentUser.uid + findUser!.uid
			: findUser!.uid + currentUser.uid

		await useSearchUserChats({ combinedId, findUser, currentUser })

		setFindUser(null)
		setFindUserName('')
	}


	return (
		<div className={cl.searchUser}>
			<Input
				value={findUserName}
				onKeyDown={handleKeyDown}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFindUserName(e.target.value)}
				placeholder='Search a user..' />
			<ul className={cl.users}>
				{findUser && (
					<li
						onClick={useHandleSelect}
						className={cl.chatSearched}>
						<img src={findUser.photoURL} alt="" />
						<span>{findUser.displayName}</span>
					</li>
				)}
			</ul>
		</div>
	)
}
