import { doc, onSnapshot } from 'firebase/firestore'
import React, { useState } from 'react'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import { Loader } from '../../UI/loader/Loader'
import cl from './../../Pages/chats/Chats.module.scss'
import { ChatSenders } from './ChatSenders'
import { Message } from './message/Message'


export interface IMessage {
	date: any,
	id: string,
	senderId: string,
	text: string,
	img?: any
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
			<span className={cl.chatUsername}>
				{clickedUser?.displayName}
			</span>
			<ul className={cl.chats}>
				{messages.map(m => {
					return (
						<Message key={m.id} message={m} />
					)
				})}
			</ul>
			<ChatSenders />
		</div>
	)
}
