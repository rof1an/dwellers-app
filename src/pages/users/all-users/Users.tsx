import { User } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import addFriend from '../../../assets/addFriend.png'
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

	React.useEffect(() => fetchUsers(), [])

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
						users.filter(users => users.uid !== currentUser?.uid).map((user) => {
							return (
								<li key={user.uid} className={cl.userItem}>
									{user.photoURL &&
										<img onClick={() => selectUser(user)}
											src={user.photoURL}
											className={cl.userPhoto} alt='' />
									}
									<div className={cl.info}>
										<span className={cl.userName}>{user.displayName}</span>
										<button
											onClick={() => checkSendRequest(user)}
											className={cl.addFriendBtn}>
											<img
												src={addFriend}
												alt='add'
											/>
										</button>
									</div>
								</li>
							)
						})
					)}
				</ul>
			</div>
		</div>
	)
}
