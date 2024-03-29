import { useState } from 'react'
import addImg from '../../assets/addImg.png'
import { Button } from '../../components/UI/button/Button'
import { Input } from '../../components/UI/input/Input'
import { useAppSelector } from '../../hooks/hooks'
import cl from './../../pages/chats/Chats.module.scss'
import { handleSend } from './functions'

export const ChatSenders = () => {
	const [text, setText] = useState('')
	const [img, setImg] = useState<File | null>(null)
	const [imgUrl, setImgUrl] = useState<string | null>(null)
	const [isImageModalOpen, setIsImageModalOpen] = useState(false)

	const data = useAppSelector((state) => state.chat)
	const { lastSender } = useAppSelector(state => state.chat)

	const handleSendMessage = () => {
		handleSend({ img, data, text, lastSender })
		setText('')
		setImg(null)
		setImgUrl(null)
		window.scrollTo(0, document.body.scrollHeight)
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSendMessage()
		}
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0]
		if (selectedFile) {
			setImg(selectedFile)
			setImgUrl(URL.createObjectURL(selectedFile))
		}
	}

	return (
		<>
			<div className={cl.chatSenders}>
				<Input
					value={text}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
					className={cl.input}
					placeholder='Type a message...'
					onKeyPress={handleKeyPress}
				/>
				<label htmlFor='file' className={cl.iconLabel}>
					<input type='file' id='file' style={{ display: 'none' }} onChange={handleImageChange} />
					<img src={addImg} alt='img' />
				</label>
				{imgUrl && (
					<img
						onClick={() => setIsImageModalOpen(true)}
						src={imgUrl}
						alt='selected'
						className={cl.selectedImg}
					/>
				)}
				<Button onClick={handleSendMessage}>Send</Button>
			</div>
			{isImageModalOpen && imgUrl && (
				<div
					onClick={() => setIsImageModalOpen(false)}
					className={cl.selectedImgModal}>
					<div className={cl.imgBlock}
						onClick={(e) => e.stopPropagation()}
					>
						<img
							src={imgUrl} alt='selected' className={cl.selectedImgInModal} />
						<span
							onClick={() => setIsImageModalOpen(false)}
							className={cl.close}></span>
					</div>
				</div>
			)}
		</>
	)
}
