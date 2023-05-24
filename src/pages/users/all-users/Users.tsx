import { User } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { IFriend } from '../../../@types/users-types'
import addFriend from '../../../assets/addFriend.png'
import addedFrSvg from '../../../assets/addedFriend.svg'
import { Loader } from '../../../components/UI/loader/Loader'
import { UsersNavigation } from '../../../components/users/usersNav/UsersNavigation'
import { db } from '../../../firebase'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { useFetching } from '../../../hooks/useFetching'
import { setSelectedUser } from '../../../redux/slices/users-slice/usersSlice'
import { ToastNofify } from '../../../utils/ToastNotify'
import cl from './Users.module.scss'

type HandleRequestProps = {
	recipientName: string,
	recipientUid: string,
	recipientImg: string
}

type TRequester = {
	requesterImg: string,
	requesterName: string,
	requesterUid: string
}

export const Users = () => {
	const location = useLocation().pathname
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [users, setUsers] = useState<User[]>([])
	const [usersFriends, setUsersFriends] = useState<IFriend[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isError, setIsError] = useState(false)

	const { currentUser } = useAppSelector((state) => state.auth)
	const allUsersCount = users.filter(user => user.uid !== currentUser?.uid).length

	// get all users from firebase with custom hook
	const [fetchUsers, loading, error] = useFetching(async () => {
		const querySnapshot = await getDocs(collection(db, 'users'))
		const usersData: User[] = []
		querySnapshot.forEach((doc) => {
			usersData.push(doc.data() as User)
		})
		setUsers(usersData)
		setIsLoading(loading)
		setIsError(error)
	})

	useEffect(() => fetchUsers(), [])

	useEffect(() => {
		const fetchUserFriends = async () => {
			const userFriendsDoc = await getDoc(doc(db, 'userFriends', currentUser!.uid))
			const friendsList = userFriendsDoc?.data()?.friends
			setUsersFriends(friendsList || [])
		}
		fetchUserFriends()
	}, [users])

	// send request to friend
	const handleSendRequest = async ({ recipientName, recipientUid, recipientImg }: HandleRequestProps) => {
		const refUid = `${currentUser?.displayName}${currentUser!.uid > recipientUid
			? currentUser!.uid : recipientUid}${currentUser!.uid <= recipientUid ? currentUser!.uid : recipientUid}`

		const userFriendsDoc = await getDoc(doc(db, 'userFriends', currentUser!.uid))
		const friendsList = await userFriendsDoc?.data()?.friends
		const isAlreadyFriends = friendsList && friendsList.some((friend: TRequester) => friend.requesterUid === recipientUid)

		const queryRequests = await getDocs(query(collection(db, 'friendsRequests'),
			where('recipient.uid', '==', recipientUid),
			where('requester.uid', '==', currentUser!.uid)))
		const isRequestHas = queryRequests.docs.length > 0 && queryRequests.docs[0].data()

		if (isRequestHas) {
			ToastNofify.errorNotify('Request already sent')
		} else if (!isAlreadyFriends) {
			await setDoc(doc(db, 'friendsRequests', refUid), {
				requester: {
					name: currentUser?.displayName,
					photoUrl: currentUser?.photoURL,
					uid: currentUser?.uid,
				},
				recipient: {
					name: recipientName,
					photoUrl: recipientImg,
					uid: recipientUid,
				},
			})
			ToastNofify.successNotify('Request was sended')
		}
	}

	// checking if there is a user
	const checkSendRequest = <T extends User>(user: T) => {
		if (user.displayName && user.photoURL) {
			handleSendRequest({
				recipientName: user.displayName,
				recipientUid: user.uid,
				recipientImg: user.photoURL
			})
		}
	}

	const selectUser = <T extends User>(user: T) => {
		dispatch(setSelectedUser(user))
		navigate(`/users/${user.displayName}-${user.uid}`)
	}

	const mappedFriends = usersFriends.map(friend => friend.uid)
	// console.log(mappedFriends.map(friend => friend))


	return (
		<div className={cl.root}>
			<ToastContainer />
			<UsersNavigation
				allUsers={location}
				friends='friends'
				friendsRequst={`${location}/friendsRequests`}
			/>
			<div className={cl.usersBlock}>
				<h2 className={cl.usersTitle}>
					Users in dwellers:
					<span> {allUsersCount}</span>
				</h2>
				<ul className={cl.userList}>
					{isLoading ? (
						<Loader />
					) : isError ? (
						<span>Error</span>
					) : (
						<>
							{/* ALL USERS */}
							{users
								.filter(user => user.uid !== currentUser?.uid && !mappedFriends.includes(user.uid))
								.map((user) => {
									return (
										<li key={user.uid} className={cl.userItem}>
											{user.photoURL && (
												<img
													onClick={() => selectUser(user)}
													src={user.photoURL}
													className={cl.userPhoto}
													alt=''
												/>
											)}
											<div className={cl.info}>
												<span className={cl.userName}>{user.displayName}</span>
												<button
													onClick={() => checkSendRequest(user)}
													className={cl.addFriendBtn}
													id='user-status'
												>
													<img src={addFriend} alt='add' />
													<Tooltip anchorSelect='#user-status' place='bottom' content='Add to friend' />
												</button>
											</div>
										</li>
									)
								})}
							{/* FRRIENDS IN ALL USERS CATEGORY */}
							{usersFriends.map(friend => {
								return (
									<li key={friend.uid} className={cl.userItem}>
										{friend.photoURL && (
											<img
												src={friend.photoURL}
												className={cl.userPhoto}
											/>
										)}
										<div className={cl.info}>
											<span className={cl.userName}>{friend.displayName}</span>
											<button
												className={`${cl.addFriendBtn} ${cl.addedFriend}`}
												id='friend-status'
											>
												<img src={addedFrSvg} alt="" />
												<Tooltip anchorSelect='#friend-status' place='bottom' content='Delete friend' />
											</button>
										</div>
									</li>
								)
							})}
						</>
					)}
				</ul>
			</div>
		</div>
	)
}
