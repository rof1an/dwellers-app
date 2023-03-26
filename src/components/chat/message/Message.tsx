import React from 'react'
import { useAppSelector } from '../../../hooks/hooks'
import { IMessage } from '../Chat'
import cl from './Message.module.scss'

interface MessageProps {
	message: IMessage,
	createdAt: string
}

export const Message = ({ message, createdAt }: MessageProps) => {
	const msgRef = React.useRef<HTMLDivElement>(null)

	const { currentUser } = useAppSelector(state => state.auth)
	const { clickedUser } = useAppSelector(state => state.chat)

	React.useEffect(() => {
		msgRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [message])

	return (
		<div ref={msgRef} className={`${cl.message} ${message.senderId !== currentUser?.uid && cl.owner}`}>
			<div className={cl.messageInfo}>
				<img src={`${message.senderId === currentUser?.uid ? currentUser?.photoURL : clickedUser?.photoURL}`} alt="avatar" />
				<span className={cl.messageTime}>{createdAt}</span>
			</div>
			<div className={` ${message.senderId === currentUser?.uid ? cl.messageContentOwner : cl.messageContent} `}>
				{message.text && <p>{message.text}</p>}
				{message.img && (
					<img className={cl.messageImg} src={message?.img} alt="" />
				)}
			</div>
		</div>
	)
}
