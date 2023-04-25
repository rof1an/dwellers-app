import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { FC, useEffect, useState } from 'react'
import { Lang, ProfileProps, ProfileValues } from '../../../../@types/home-types'
import { SearchData } from '../../../../@types/weather-types'
import { CitiesService } from '../../../../API/CitiesService'
import { db } from '../../../../firebase'
import { useAppSelector } from '../../../../hooks/hooks'
import { options } from '../../../../utils/languageList'
import { PaginateSelect } from '../../../UI/Selects/AsyncPaginate'
import { ReactSelect } from '../../../UI/Selects/ReactSelect'
import { Button } from '../../../UI/button/Button'
import { Input } from '../../../UI/input/Input'
import cl from './ProfileModal.module.scss'


export const ProfileModal: FC<ProfileProps> = ({ visible, setVisible, value, setValue }) => {
	const [newValues, setNewValues] = useState<ProfileValues>(value)
	const [selectedLangs, setSelectedLangs] = useState<Lang[]>([])
	const { currentUser } = useAppSelector(state => state.auth)

	useEffect(() => {
		if (currentUser?.uid) {
			const unsub = onSnapshot(doc(db, 'users', currentUser.uid), doc => {
				doc.exists() && setNewValues(doc.data() as ProfileValues)
			})
			return () => unsub()
		}
	}, [])

	const handleSubmit = async () => {
		const updatedData = {
			languages: selectedLangs,
			city: newValues.city,
			date: newValues.date
		}
		setVisible(false)
		setValue(newValues)
		await updateDoc(doc(db, 'users', currentUser!.uid), updatedData)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setNewValues(prevState => ({ ...prevState, [name]: value }))
	}

	const handleChangeCity = (searchData: SearchData) =>
		setNewValues({ ...newValues, city: searchData })

	const handleChangeLangs = (selectedOptions: Lang[]) => {
		setSelectedLangs(selectedOptions)
		setNewValues(prevValues => ({
			...prevValues,
			languages: selectedOptions.map(({ label, value }) => ({ label, value }))
		}))
	}

	const loadSelectOptions = async (value: string) =>
		await CitiesService.loadOptions(value)


	return (
		<div onClick={() => setVisible(false)}
			className={visible ? `${cl.modal} ${cl.active}` : `${cl.modal}`}>
			<form
				onSubmit={e => e.preventDefault()}
				onClick={e => e.stopPropagation()}
				className={cl.modalContent}>
				<h2>Change your information</h2>
				<div className={cl.formItem}>
					<div className={cl.itemBlock}>
						<span className={cl.formLabel}>Your date of birth</span>
						<span className={cl.deleteItemValue}>delete value</span>
					</div>
					<Input
						onChange={handleInputChange}
						value={newValues.date !== undefined && newValues.date}
						name='date' type='date'
						className={cl.formInput}
					/>
				</div>
				<div className={cl.formItem}>
					<div className={cl.itemBlock}>
						<span className={cl.formLabel}>Languages</span>
						<span className={cl.deleteItemValue}>delete value</span>
					</div>
					<ReactSelect
						selectedOption={newValues.languages}
						handleChange={handleChangeLangs}
						options={options}
						placeholder="Select language(s)"
						isMulti={true}
					/>
				</div>
				<div className={cl.paginateWrapper}>
					<div className={cl.itemBlock}>
						<span className={cl.formLabel}>Select the city</span>
						<span className={cl.deleteItemValue}>delete value</span>
					</div>
					<PaginateSelect
						newValues={newValues}
						handleSelectChange={handleChangeCity}
						loadSelectOptions={loadSelectOptions}
					/>
					{!newValues && <span className={cl.placeholder}>Select city</span>}
				</div>
				<Button onClick={handleSubmit}>Save</Button>
			</form>
		</div>
	)
}
