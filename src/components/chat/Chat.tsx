import { format } from 'date-fns'
import { doc, onSnapshot } from 'firebase/firestore'
import React, { useState } from 'react'
import { db } from '../../firebase'
import { useAppSelector } from '../../hooks/hooks'
import cl from './../../pages/chats/Chats.module.scss'
import { ChatSenders } from './ChatSenders'
import { Message } from './message/Message'

export interface IMessage {
	date: {
		nanoseconds: number,
		seconds: number
	},
	id: string,
	senderId: string,
	text: string,
	img?: string
}

export const Chat = () => {
	const [messages, setMessages] = useState<IMessage[]>([])
	const { chatId, clickedUser } = useAppSelector(state => state.chat)

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


	return (
		<div className={cl.chatInfo}>
			{clickedUser && (
				<span className={cl.chatUsername}>
					<img src={clickedUser?.photoURL} alt="" />
					{clickedUser?.displayName}
				</span>
			)}
			<ul className={cl.chats}>
				{messages.map(m => {
					const createdAt = new Date((m?.date.seconds * 1000) + (m?.date.nanoseconds / 1000000))
					const timeAgo = format(createdAt, 'HH:mm')

					return (
						<Message key={m.id} message={m} createdAt={timeAgo} />
					)
				})}
			</ul>
			<ChatSenders />
		</div>
	)
}
