import { useState } from 'react'
import addImg from '../../../assets/addImg.png'
import { useAppSelector } from '../../../hooks/hooks'
import { useHandleSend } from '../../../hooks/useHandleSend'
import { Button } from '../../UI/button/Button'
import { Input } from '../../UI/input/Input'
import cl from './../../Pages/chats/Chats.module.scss'

export const ChatSenders = () => {
	const [text, setText] = useState('')
	const [img, setImg] = useState<File | null>(null)

	const { currentUser } = useAppSelector(state => state.auth)
	const data = useAppSelector(state => state.chat)


	const useSendMessage = () => {
		useHandleSend({ img, data, text })
		setText('')
		setImg(null)
	}

	return (
		<div className={cl.chatSenders}>
			<Input
				value={text}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
				className={cl.input} placeholder='Type a message...' />
			<input
				type='file' id='file'
				style={{ display: 'none' }}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					const selectedFile = e.target.files?.[0]
					selectedFile && setImg(selectedFile)
				}}
			/>
			<label className={cl.iconLabel} htmlFor='file'>
				<img src={addImg} alt='img' />
			</label>
			<Button onClick={useSendMessage}>Send</Button>
		</div>
	)
}
