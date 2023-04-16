import { updateProfile } from 'firebase/auth'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { ProfileData } from '../../../@types/home-types'
import changeSvg from '../../../assets/edit-svgrepo-com.svg'
import closedAccSvg from '../../../assets/icons8-замок.svg'
import { auth, db, storage } from '../../../firebase'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { fetchCurrentUser, setAccountData } from '../../../redux/slices/auth-slice/authSlice'
import { AccountData } from '../../../redux/slices/auth-slice/types'
import { Button } from '../../UI/button/Button'
import { Loader } from '../../UI/loader/Loader'
import cl from './Profile.module.scss'
import { ProfileModal } from './profileModal/ProfileModal'

export const Profile = () => {
	const dispatch = useAppDispatch()
	const [modalVisible, setModalVisible] = useState<boolean>(false)
	const [isPrivateAcc, setIsPrivateAcc] = useState(false)
	const [data, setData] = useState<ProfileData>({
		city: { label: '', value: '' }, date: '', languages: [],
	})
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const { currentUser } = useAppSelector((state) => state.auth)
	const displayName = currentUser?.displayName?.replace(/^\w/, (c: string) => c.toUpperCase())

	useEffect(() => {
		dispatch(fetchCurrentUser())
	}, [currentUser])

	useEffect(() => {
		if (currentUser?.uid) {
			const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
				setIsLoading(true)
				setData((prevData) => ({ ...prevData, ...doc.data() }))
				setIsPrivateAcc(doc.data()?.isPrivate)
				dispatch(setAccountData(doc.data() as AccountData))
				setIsLoading(false)
			})
			return () => unsub()
		}
	}, [currentUser])

	useEffect(() => {
		handleChangeAvatar()
	}, [selectedFile])

	const handleChangeAvatar = async () => {
		if (auth.currentUser && selectedFile) {
			const storageRef = ref(storage, `${'avatar'}-${currentUser?.displayName}-${currentUser?.email}`)
			const downloadURL = await getDownloadURL(storageRef)

			await uploadBytes(storageRef, selectedFile)
			await updateProfile(auth.currentUser, {
				photoURL: downloadURL,
			})
			await updateDoc(doc(db, 'users', currentUser!.uid), {
				photoURL: downloadURL,
			})

			dispatch(fetchCurrentUser())
		}
	}

	return (
		<div>
			{isLoading && <Loader />}
			<div className={cl.mainInfo}>
				<div className={cl.avatar}>
					{currentUser?.photoURL && <img className={cl.mainImg} src={currentUser.photoURL} />}
					<input
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							e.target.files?.[0] && setSelectedFile(e.target.files?.[0])
						}
						style={{ display: 'none' }}
						type='file'
						id='file'
					/>
					<label className={cl.formLabel} htmlFor='file'>
						<img className={cl.changeMainImg} src={changeSvg} alt='#' />
					</label>
				</div>
				<div className={cl.mainAbout}>
					<div className={cl.nameBlock}>
						<h2 className={cl.profileTitle}>{displayName}</h2>
						{isPrivateAcc && <img src={closedAccSvg} alt="" />}
					</div>
					<hr />
					<div className={cl.subBlock}>
						<h3 className={cl.subtitle}>
							<img src={changeSvg} alt='#' />
							<p>Frontend developer</p>
						</h3>
						<Button onClick={() => setModalVisible(true)}>Change information</Button>
					</div>
					<div className={cl.profileInfo}>
						<div className={cl.left}>
							<p>Date of birth:</p>
							<p>Languages:</p>
							<p>City:</p>
						</div>
						<div className={cl.right}>
							<p>{data.date ? data.date : <span className={cl.emptyInfo}>none</span>}</p>
							<p>{data.languages?.length > 0 ? data.languages.map((l) => l.label).join(', ') : <span className={cl.emptyInfo}>none</span>}</p>
							<p>{data.city.label ? data.city.label : <span className={cl.emptyInfo}>none</span>}</p>
						</div>
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
