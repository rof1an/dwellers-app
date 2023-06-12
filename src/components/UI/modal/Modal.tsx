import cl from './Modal.module.scss'

interface ModalWindowProps {
	isOpen: boolean
	setIsOpen: any
	children: any
}

export const Modal = ({ isOpen, setIsOpen, children }: ModalWindowProps) => {
	return (
		<div
			onClick={() => setIsOpen(!isOpen)}
			className={isOpen ? `${cl.root} ${cl.active}` : `${cl.active}`}>
			<div
				onClick={e => e.stopPropagation()}
				className={cl.modalContent}>
				{children}
			</div>
		</div>
	)
}