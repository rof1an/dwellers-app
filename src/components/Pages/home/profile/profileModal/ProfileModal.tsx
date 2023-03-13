import { doc, updateDoc } from 'firebase/firestore'
import React, { FC, useState } from 'react'
import closeSvg from '../../../../../assets/close-boxed-svgrepo-com.svg'
import { Button } from '../../../../../components/UI/button/Button'
import { Input } from '../../../../../components/UI/input/Input'
import { auth, db } from '../../../../../firebase'
import { useAppDispatch } from '../../../../../hooks/hooks'
import cl from './ProfileModal.module.scss'

type ValuesProps = {
	city: string
	date: string
	languages: string
}

interface ProfileProps {
	visible: boolean
	value: ValuesProps
	setValue: (arg: ValuesProps) => void
	setVisible: (arg: boolean) => void
}

export const ProfileModal: FC<ProfileProps> = ({ visible, setVisible, value, setValue }) => {
	const dispatch = useAppDispatch()
	const [newValues, setNewValues] = useState<ValuesProps>({ ...value })

	const rootClasses = [cl.modal]
	visible && rootClasses.push(cl.active)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setNewValues(prevState => ({ ...prevState, [name]: value }))
		localStorage.setItem(name, value)
	}

	React.useEffect(() => {
		const city = localStorage.getItem('city')
		const date = localStorage.getItem('date')
		const languages = localStorage.getItem('languages')

		if (city || date || languages) {
			setNewValues(prevState => ({
				...prevState,
				city: city || prevState.city,
				date: date || prevState.date,
				languages: languages || prevState.languages,
			}))
		}
	}, [])

	const handleSaveClick = async () => {
		const ref = doc(db, 'users', auth.currentUser!.uid)
		await updateDoc(ref, {
			languages: newValues.languages,
			date: newValues.date,
			city: newValues.city,
		})

		setValue(newValues)
		setVisible(false)
	}

	const handleInputCloseClick = (name: keyof ValuesProps) => {
		setNewValues({ ...newValues, [name]: '' })
		localStorage.removeItem(name)
	}

	return (
		<div onClick={() => setVisible(false)} className={rootClasses.join(' ')}>
			<form
				onSubmit={e => e.preventDefault()}
				onClick={e => e.stopPropagation()}
				className={cl.modalContent}>
				<div className={cl.formItem}>
					<Input
						onChange={handleInputChange}
						value={newValues.date}
						name='date'
						type='text'
						className={cl.formInput}
					/>
					<label className={cl.formLabel}>Enter your date of birth</label>
					{newValues.date && (
						<img
							onClick={() => handleInputCloseClick('date')}
							className={cl.closeIcon}
							src={closeSvg}
							alt=''
						/>
					)}
				</div>
				<div className={cl.formItem}>
					<Input
						onChange={handleInputChange}
						value={newValues.languages}
						name='languages'
						type='text'
						className={cl.formInput}
					/>
					<label className={cl.formLabel}>Enter your languages</label>
					{newValues.languages && (
						<img
							onClick={() => handleInputCloseClick('languages')}
							className={cl.closeIcon}
							src={closeSvg}
							alt=''
						/>
					)}
				</div>
				<div className={cl.formItem}>
					<Input
						onChange={handleInputChange}
						value={newValues.city}
						name='city'
						type='text'
						className={cl.formInput}
					/>
					<label className={cl.formLabel}>Enter your city</label>
					{newValues.city && (
						<img
							onClick={() => handleInputCloseClick('city')}
							className={cl.closeIcon}
							src={closeSvg}
							alt=''
						/>
					)}
				</div>
				<Button onClick={handleSaveClick}>Save</Button>
			</form>
		</div>
	)
}
