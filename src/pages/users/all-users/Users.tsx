import { User } from 'firebase/auth'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import addFriend from '../../../assets/addFriend.png'
import { Loader } from '../../../components/UI/loader/Loader'
import { UsersNavigation } from '../../../components/users/usersNav/UsersNavigation'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import { useFetching } from '../../../hooks/useFetching'
import cl from './Users.module.scss'

type HandleRequestProps = {
	recipientName: string,
	recipientUid: string,
	recipientImg: string
}

export const Users = () => {
	const location = useLocation().pathname
	const [users, setUsers] = useState<User[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isError, setIsError] = useState(false)
	const { currentUser } = useAppSelector((state) => state.auth)

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
		const refUid = currentUser!.uid > recipientUid
			? currentUser?.displayName + currentUser!.uid + recipientUid : currentUser?.displayName + recipientUid + currentUser!.uid
		const requestRef = doc(db, 'friendsRequests', refUid)

		// check if request to friends didn't yet
		// if (querySnapshot.size === 0) {
		await setDoc(requestRef, {
			requester: {
				name: currentUser?.displayName,
				photoUrl: currentUser?.photoURL,
				uid: currentUser?.uid,
			},
			recipient: {
				name: recipientName,
				photoUrl: recipientImg,
				uid: recipientUid
			}
		})
		// }
	}

	// checking if there is a user
	const checkSendRequest = (user: User) => {
		if (user.displayName && user.photoURL) {
			handleSendRequest({
				recipientName: user.displayName,
				recipientUid: user.uid,
				recipientImg: user.photoURL
			})
		}
	}

	return (
		<div className={cl.root}>
			<UsersNavigation
				allUsers={location}
				friends='friends'
				friendsRequst={`${location}/friendsRequests`}
			/>
			<ul className={cl.userList}>
				{isLoading ? (
					<Loader />
				) : isError ? (
					<span>Error</span>
				) : (
					users.filter(currUser => currUser.uid !== currentUser?.uid).map((user) => {
						return (
							<li className={cl.userItem} key={user.uid}>
								{user.photoURL && <img src={user.photoURL} className={cl.userPhoto} alt='' />}
								<div className={cl.info}>
									<span className={cl.userName}>{user.displayName}</span>
									<img
										onClick={() => checkSendRequest(user)}
										src={addFriend}
										alt='add'
									/>
								</div>
							</li>
						)
					})
				)}
			</ul>
		</div>
	)
}