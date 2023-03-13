import { updateProfile } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import React, { useState } from 'react'
import changeSvg from '../../../../assets/edit-svgrepo-com.svg'
import { auth, db } from '../../../../firebase'
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks'
import { fetchCurrentUser } from '../../../../redux/slices/auth-slice/authSlice'
import { Button } from './../../../../components/UI/button/Button'
import cl from './Profile.module.scss'
import { ProfileModal } from './profileModal/ProfileModal'

export const Profile = () => {
	const dispatch = useAppDispatch()
	const [modalVisible, setModalVisible] = useState<boolean>(false)
	const [data, setData] = useState({ city: '', date: '', languages: '' })
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const { currentUser } = useAppSelector(state => state.auth)
	const displayName = currentUser?.displayName?.replace(/^\w/, (c: string) => c.toUpperCase())

	React.useEffect(() => {
		dispatch(fetchCurrentUser())
	}, [currentUser])

	React.useEffect(() => {
		if (currentUser?.uid) {
			const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc: any) => {
				setData({
					...data,
					...doc.data(),
				})
			})

			if (auth.currentUser && selectedFile) {
				handleChangeAvatar()
			}

			return () => {
				unsub()
			}
		}
	}, [selectedFile])

	const handleChangeAvatar = async () => {
		if (auth.currentUser && selectedFile) {
			const fileUrl = URL.createObjectURL(selectedFile)
			await updateProfile(auth.currentUser, {
				photoURL: fileUrl
			})
			dispatch(fetchCurrentUser())
		}
	}

	return (
		<div>
			<div className={cl.mainInfo}>
				<div className={cl.avatar}>
					<img className={cl.mainImg} src={currentUser?.photoURL} />
					<input
						onChange={(e: any) => setSelectedFile(e.target.files[0])}
						style={{ display: 'none' }} type="file" id='file' />
					<label className={cl.formLabel} htmlFor="file">
						<img className={cl.changeMainImg} src={changeSvg} alt='#' />
					</label>
				</div>
				<div className={cl.mainAbout}>
					<h2 className={cl.profileTitle}>{displayName}</h2>
					<hr />
					<h3 className={cl.subtitle}>
						<img src={changeSvg} alt='#' />
						<p>Frontend developer</p>
					</h3>
					<div className={cl.profileInfo}>
						<div className={cl.left}>
							<p>Date of birth:</p>
							<p>Languages:</p>
							<p>City:</p>
						</div>
						<div className={cl.right}>
							<p>{data.date}</p>
							<p>{data.languages}</p>
							<p>{data.city}</p>
						</div>
						<Button onClick={() => setModalVisible(true)}>Change information</Button>
					</div>
				</div>
			</div>
			<ProfileModal
				value={data}
				setValue={setData}
				visible={modalVisible}
				setVisible={setModalVisible}
			/>
		</div>
	)
}
