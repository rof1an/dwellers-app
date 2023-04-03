import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import React, { useState } from 'react'
import { ChatsProps } from '../../@types/chat-types'
import { Loader } from '../../components/UI/loader/Loader'
import { ChatSearch } from '../../components/chat/ChatSearch'
import { db } from '../../firebase'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setChatInfo, setCurrentUser, setLastSender } from '../../redux/slices/chat-slice/chatSlice'
import { UserInfo } from '../../redux/slices/chat-slice/types'
import { getBothUid } from '../../utils/getBothUid'
import { Chat } from './../../components/chat/Chat'
import cl from './Chats.module.scss'


export const Chats = () => {
	const dispatch = useAppDispatch()
	const [chats, setChats] = useState<ChatsProps[]>([])
	const [selectedUser, setSelectedUser] = useState<any>({})

	const { currentUser } = useAppSelector(state => state.auth)
	const { lastSenderId, clickedUser } = useAppSelector(state => state.chat)
	const chatsArray = Object.entries(chats)

	React.useEffect(() => {
		const getData = async () => {
			const getChats = onSnapshot(doc(db, "userChats", currentUser!.uid), (doc) => {
				setChats(doc.data() as ChatsProps[])
			})
			return () => getChats()
		}
		currentUser?.uid && getData()

		return () => {
			dispatch(setChatInfo(null))
		}
	}, [currentUser?.uid])

	React.useEffect(() => {
		const getLastSender = async () => {
			const uid = getBothUid.getUid(currentUser!.uid, clickedUser!.uid)
			const docSnap = await getDoc(doc(db, "chats", uid))
			const data = docSnap.data()?.messages
			dispatch(setLastSender(data[data.length - 1]))
		}

		getLastSender()
	})

	const handleSelect = async (clickedUserInfo: UserInfo) => {
		dispatch(setCurrentUser(currentUser as UserInfo))
		dispatch(setChatInfo(clickedUserInfo))
		setSelectedUser(clickedUserInfo)
	}

	return (
		<>
			{chats.length === 0 && <Loader />}
			<div className={cl.root}>
				<div className={cl.userList}>
					<ul className={cl.users}>
						<ChatSearch />
						{chatsArray.length === 0 ? (
							<span className={cl.noChats}>No chats yet!</span>
						) : (
							<>
								{chatsArray.sort((a, b) => b[1].date - a[1].date).map(chat => {
									return (
										<li className={selectedUser === chat[1].userInfo ? `${cl.user} ${cl.selectedUser}` : `${cl.user}`}
											key={chat[0]}
											onClick={() => handleSelect(chat[1].userInfo)}
										>
											{chat[1]?.userInfo?.photoURL && <img src={chat[1].userInfo.photoURL} alt="" />}
											<div className={cl.userText}>
												<span className={cl.userName}>{chat[1]?.userInfo?.displayName}</span>
												{chat[1].lastMessage?.text && (
													<span className={cl.lastMsg}>
														{lastSenderId && (
															<b>{lastSenderId === currentUser?.uid ? 'You' : 'He'}: </b>
														)}
														{chat[1].lastMessage?.text}
													</span>
												)}
											</div>
										</li>
									)
								})}
							</>
						)}
					</ul>
				</div>
				<Chat />
			</div>
		</>
	)
}
