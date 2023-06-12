import { deleteUser, signOut, updateProfile } from 'firebase/auth'
import { deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { ProfileData } from '../../../@types/home-types'
import arrowDown from '../../../assets/arrow-down-sign-to-navigate.png'
import changeSvg from '../../../assets/edit-svgrepo-com.svg'
import { default as closedAccSvg } from '../../../assets/icons8-замок.svg'
import { auth, db, storage } from '../../../firebase'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { fetchCurrentUser, setAccountData, setAuth } from '../../../redux/slices/auth-slice/authSlice'
import { AccountData } from '../../../redux/slices/auth-slice/types'
import { ToastNofify } from '../../../utils/ToastNotify'
import { Button } from '../../UI/button/Button'
import { Loader } from '../../UI/loader/Loader'
import { Modal } from '../../UI/modal/Modal'
import cl from './Profile.module.scss'
import { ProfileModal } from './profileModal/ProfileModal'
import { ProfileSettings } from './profileSettings/ProfileSettings'

export const Profile = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false)
	const [optionsModalVisible, setOptionsModalVisible] = useState<boolean>(false)
	const [isPrivateAcc, setIsPrivateAcc] = useState(false)
	const [data, setData] = useState<ProfileData>({
		city: { label: '', value: '' }, date: '', languages: [], subtitle: ''
	})
	const [editingSubtitle, setEditingSubtitle] = useState<boolean>(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const inputRef = useRef<HTMLInputElement | null>(null)

	const { currentUser } = useAppSelector((state) => state.auth)
	const displayName = currentUser?.displayName?.replace(/^\w/, (w: string) => w.toUpperCase())

	useEffect(() => {
		dispatch(fetchCurrentUser())
	}, [currentUser?.uid])

	useEffect(() => {
		if (currentUser?.uid) {
			const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
				setIsLoading(true)
				setData((prevData) => ({ ...prevData, ...doc.data() }))
				setIsPrivateAcc(doc.data()?.isPrivate)
				dispatch(setAccountData(doc.data() as AccountData))
				setIsLoading(false)
			})

			const unsubSettings = onSnapshot(doc(db, 'userSettings', currentUser.uid), (doc) => {
				setIsLoading(true)
				setIsPrivateAcc(doc.data()?.isPrivate)
				setIsLoading(false)
			})

			return () => {
				unsub()
				unsubSettings()
			}
		}
	}, [currentUser?.uid])

	useEffect(() => {
		const updateData = async () => {
			await handleChangeAvatar()
			dispatch(fetchCurrentUser())
		}
		updateData()
	}, [selectedFile])

	const handleChangeAvatar = async () => {
		if (currentUser?.uid && selectedFile) {
			try {
				setIsLoading(true)
				const storageRef = ref(storage, `${'avatar'}-${currentUser?.email}`)
				const downloadURL = await getDownloadURL(storageRef)

				await uploadBytes(storageRef, selectedFile)
				await updateProfile(currentUser, {
					photoURL: downloadURL,
				})
				await updateDoc(doc(db, 'users', currentUser!.uid), {
					photoURL: downloadURL,
				})

				// dispatch(fetchCurrentUser())
			} catch (error) {
				ToastNofify.errorNotify('Something went wrong, try later')
			} finally {
				setIsLoading(false)
			}
		}
	}

	const deleteAccount = async () => {
		try {
			if (currentUser) {
				await deleteDoc(doc(db, "users", currentUser.uid))
				await deleteDoc(doc(db, "userSettings", currentUser.uid))
				await deleteDoc(doc(db, "userPosts", currentUser.uid))
				await deleteDoc(doc(db, "userChats", currentUser.uid))
				await deleteDoc(doc(db, "friendsRequests", currentUser.uid))
				await signOut(auth).then(() => {
					dispatch(setAuth(false))
					localStorage.removeItem('persist:root')
					setOptionsModalVisible(false)
					navigate('/')
				})
				await deleteUser(currentUser)
			}
		} catch (error) {
			console.error(error)
		}
	}

	const privateAccount = () => {
		if (currentUser) {
			setIsPrivateAcc(!isPrivateAcc)
			updateDoc(doc(db, 'userSettings', currentUser.uid), {
				isPrivate: !isPrivateAcc
			})
		}
	}

	const handleEditSubtitleClick = () => {
		setEditingSubtitle(true)
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}

	const handleChangeSubtitleInfo = () => {
		if (currentUser?.uid) {
			updateDoc(doc(db, 'users', currentUser.uid), {
				subtitle: data.subtitle,
			})
		}
		setEditingSubtitle(false)
	}


	return (
		<div className={cl.root}>
			{isLoading && <Loader />}
			<ToastContainer />
			<div className={cl.emptyShadow}></div>
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
						{isPrivateAcc &&
							<>
								<img src={closedAccSvg} id='close-acc' />
								<Tooltip anchorSelect='#close-acc' place='right' content='Your account is private' />
							</>
						}
					</div>
					{/* <hr /> */}
					<div className={cl.subBlock}>
						<div className={cl.subtitle}>
							{editingSubtitle ? (
								<div className={cl.editingSubtitleBlock}>
									<input
										className={cl.editingSubtitleInput}
										value={data?.subtitle}
										onChange={(e) => setData({ ...data, subtitle: e.target.value })}
										onKeyDown={(e) => e.keyCode === 13 && handleChangeSubtitleInfo()}
										onBlur={handleChangeSubtitleInfo}
										ref={inputRef}
										placeholder='New status...'
										type="text"
									/>
									<img className={cl.changeSubBtn} src={changeSvg} alt="" />
								</div>
							) : (
								<div
									style={{ display: 'flex' }}
									onClick={handleEditSubtitleClick}
								>
									<img src={changeSvg} alt="#" />
									{data?.subtitle ? (
										<p onClick={handleChangeSubtitleInfo}>
											{data?.subtitle}
										</p>
									) : (
										<p>Click to change status</p>
									)}
								</div>
							)}
						</div>
						<div className={cl.btns}>
							<Button onClick={() => setProfileModalVisible(true)}>Change information</Button>
							<div className={cl.moreBtn}>
								<Button onClick={() => setOptionsModalVisible(true)}>
									More
									<img src={arrowDown} alt="" />
								</Button>
							</div>
						</div>
					</div>

					{optionsModalVisible && (
						<Modal isOpen={optionsModalVisible} setIsOpen={setOptionsModalVisible}>
							<h2 className={cl.modalTitle}>Account options</h2>
							<ProfileSettings
								privateAccount={privateAccount}
								deleteAccount={deleteAccount}
								isPrivateAcc={isPrivateAcc}
							/>
						</Modal>
					)}


					<div className={cl.profileInfo}>
						<div>
							<p>Date of birth:</p>
							<p>{data?.date ? data.date : <span className={cl.emptyInfo}>none</span>}</p>
						</div>
						<div>
							<p>City:</p>
							<p>{data?.city?.label ? data.city.label : <span className={cl.emptyInfo}>none</span>}</p>
						</div>
						<div>
							<p>Languages:</p>
							<p>{data?.languages?.length > 0 ? data.languages.map((l) => l.label).join(', ') : <span className={cl.emptyInfo}>none</span>}</p>
						</div>
					</div>
				</div>
			</div>
			<ProfileModal
				data={data}
				//@ts-ignore
				setData={setData}
				visible={profileModalVisible}
				setVisible={setProfileModalVisible}
			/>
		</div>
	)
}

