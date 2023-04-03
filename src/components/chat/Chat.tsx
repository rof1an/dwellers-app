import { format } from 'date-fns'
import { doc, onSnapshot } from 'firebase/firestore'
import React, { useRef, useState } from 'react'
import { IMessage } from '../../@types/chat-types'
import { db } from '../../firebase'
import { useAppSelector } from '../../hooks/hooks'
import cl from './../../pages/chats/Chats.module.scss'
import { ChatSenders } from './ChatSenders'
import { Message } from './message/Message'


export const Chat = () => {
	const chatContainerRef = useRef<HTMLUListElement>(null)
	const [messages, setMessages] = useState<IMessage[]>([])
	const { chatId, clickedUser } = useAppSelector(state => state.chat)
	const { currentUser } = useAppSelector(state => state.auth)
	// const chatId = getBothUid.getUid(selectedUser?.uid, currentUser!.uid)

	React.useEffect(() => {
		if (chatId) {
			const unsub = onSnapshot(doc(db, 'chats', chatId), (doc) => {
				doc.exists() && setMessages(doc.data().messages)
			})

			return () => {
				unsub()
			}
		}
	}, [chatId])

	React.useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
		}
	}, [messages])

	return (
		<div className={cl.chatInfo}>
			{clickedUser && (
				<>
					<span className={cl.chatUsername}>
						{clickedUser?.photoURL && <img src={clickedUser?.photoURL} alt="" />}
						{clickedUser?.displayName}
					</span>

					<ul ref={chatContainerRef} className={cl.chats}>
						{messages.map(m => {
							const createdAt = new Date((m?.date.seconds * 1000) + (m?.date.nanoseconds / 1000000))
							const timeAgo = format(createdAt, 'HH:mm')

							return (
								<Message key={m.id} message={m} createdAt={timeAgo} />
							)
						})}
					</ul>
					<ChatSenders />
				</>
			)}
		</div>
	)
}
