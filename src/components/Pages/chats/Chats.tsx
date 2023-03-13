import { doc, onSnapshot } from 'firebase/firestore'
import React, { useState } from 'react'
import { ChatSearch } from '../../../components/Pages-components/chat/ChatSearch'
import { db } from '../../../firebase'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { setChatInfo, setCurrentUser } from '../../../redux/slices/chat-slice/chatSlice'
import { UserInfo } from '../../../redux/slices/chat-slice/types'
import { Chat } from './../../Pages-components/chat/Chat'
import cl from './Chats.module.scss'

type LastMsg = {
	text: string
}
interface ChatsProps {
	date: number,
	userInfo: UserInfo,
	lastMessage: LastMsg
}

export const Chats = () => {
	const dispatch = useAppDispatch()
	const [chats, setChats] = useState<ChatsProps[]>([])
	const { currentUser } = useAppSelector(state => state.auth)

	React.useEffect(() => {
		const getData = () => {
			const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
				setChats(doc.data() as ChatsProps[])
			})

			return () => {
				unsub()
			}
		}

		currentUser.uid && getData()
	}, [currentUser.uid])

	const handleSelect = (clickedUser: UserInfo) => {
		dispatch(setCurrentUser(currentUser))
		dispatch(setChatInfo(clickedUser))
	}

	return (
		<div className={cl.root}>
			<div className={cl.userList}>
				<ul className={cl.users}>
					<ChatSearch />
					{Object.entries(chats).sort((a, b) => b[1].date - a[1].date).map(chat => {
						return (
							<li key={chat[0]} onClick={() => {
								handleSelect(chat[1].userInfo)
							}}>
								<img src={chat[1].userInfo.photoUrl} alt="" />
								<div className={cl.userText}>
									<span>{chat[1].userInfo.displayName}</span>
									<span className={cl.lastMsg}>{chat[1].lastMessage?.text}</span>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
			<Chat />
		</div>
	)
}
