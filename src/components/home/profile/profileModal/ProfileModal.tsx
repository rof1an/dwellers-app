import { doc, updateDoc } from 'firebase/firestore'
import React, { FC } from 'react'
import { Lang, ProfileProps } from '../../../../@types/home-types'
import { SearchData } from '../../../../@types/weather-types'
import { CitiesService } from '../../../../API/CitiesService'
import { ReactComponent as DeleteValsIcon } from '../../../../assets/profileModal/deleteVals.svg'
import { db } from '../../../../firebase'
import { useAppSelector } from '../../../../hooks/hooks'
import { options } from '../../../../utils/languageList'
import { PaginateSelect } from '../../../UI/Selects/AsyncPaginate'
import { ReactSelect } from '../../../UI/Selects/ReactSelect'
import { Button } from '../../../UI/button/Button'
import { Input } from '../../../UI/input/Input'
import cl from './ProfileModal.module.scss'


export const ProfileModal: FC<ProfileProps> = ({ visible, setVisible, data, setData }) => {
	const { currentUser } = useAppSelector(state => state.auth)

	const loadSelectOptions = async (value: string) =>
		await CitiesService.loadOptions(value)


	const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setData({ ...data, date: value })
	}

	const handleChangeCity = (searchData: SearchData) =>
		setData({ ...data, city: searchData })

	const handleChangeLangs = (selectedOptions: Lang[]) => {
		setData({
			...data,
			languages: selectedOptions.map(({ label, value }) => ({ label, value }))
		})
	}

	const handleSubmit = async () => {
		const updatedData = {
			languages: data?.languages,
			city: data?.city,
			date: data?.date
		}
		setData(updatedData)
		setVisible(false)
		await updateDoc(doc(db, 'users', currentUser!.uid), updatedData)
	}

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
						<span className={cl.deleteItemValue}>
							<DeleteValsIcon />
							delete value
						</span>
					</div>
					<Input
						onChange={handleChangeDate}
						value={data?.date !== undefined && data?.date}
						name='date' type='date'
						className={cl.formInput}
					/>
				</div>
				<div className={cl.formItem}>
					<div className={cl.itemBlock}>
						<span className={cl.formLabel}>Languages</span>
						<span className={cl.deleteItemValue}>
							<DeleteValsIcon />
							delete value
						</span>
					</div>
					<ReactSelect
						selectedOption={data?.languages}
						handleChange={handleChangeLangs}
						options={options}
						placeholder="Select language(s)"
						isMulti={true}
					/>
				</div>
				<div className={cl.paginateWrapper}>
					<div className={cl.itemBlock}>
						<span className={cl.formLabel}>Select the city</span>
						<span className={cl.deleteItemValue}>
							<DeleteValsIcon />
							delete value
						</span>
					</div>
					<PaginateSelect
						newValues={data}
						handleSelectChange={handleChangeCity}
						loadSelectOptions={loadSelectOptions}
					/>
					{!data && <span className={cl.placeholder}>Select city</span>}
				</div>
				<Button onClick={handleSubmit}>Save</Button>
			</form>
		</div>
	)
}
