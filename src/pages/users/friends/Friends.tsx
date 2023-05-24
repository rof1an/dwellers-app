import { User } from 'firebase/auth'
import { arrayRemove, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { IFriend } from '../../../@types/users-types'
import { Button } from '../../../components/UI/button/Button'
import { UsersNavigation } from '../../../components/users/usersNav/UsersNavigation'
import { db } from '../../../firebase'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { setChatInfo } from '../../../redux/slices/chat-slice/chatSlice'
import { TUserInfo } from '../../../redux/slices/chat-slice/types'
import { setSelectedUser } from '../../../redux/slices/users-slice/usersSlice'
import { getBothUid } from '../../../utils/getBothUid'
import { Requester } from '../friends-requests/FriendsRequests'
import cl from './Friends.module.scss'

export const Friends = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const { currentUser } = useAppSelector(state => state.auth)
	const { selectedUser } = useAppSelector(state => state.users)
	const [friends, setFriends] = useState<IFriend[]>([])

	React.useEffect(() => {
		const unsub = onSnapshot(doc(db, 'userFriends', currentUser!.uid), (doc) => {
			const friendsData = doc.data()?.friends || []
			setFriends(friendsData)
		})

		return () => {
			unsub()
		}
	}, [])

	const deleteFriend = async (user: Requester) => {
		await updateDoc(doc(db, 'userFriends', currentUser!.uid), {
			friends: arrayRemove({
				photoURL: user.photoURL,
				uid: user.uid,
				displayName: user.displayName
			})
		})
		await updateDoc(doc(db, 'userFriends', user.uid), {
			friends: arrayRemove({
				photoURL: currentUser?.photoURL,
				uid: currentUser?.uid,
				displayName: currentUser?.displayName
			})
		})
	}

	const openChatWithFriend = async (friend: IFriend) => {
		const combinedId = getBothUid.getUid(currentUser!.uid, friend!.uid)
		const docRef = doc(db, 'chats', combinedId)
		const docSnap = await getDoc(docRef)

		dispatch(setSelectedUser(friend as User))
		dispatch(setChatInfo(friend as TUserInfo))

		if (!docSnap.exists()) {
			await setDoc(doc(db, 'chats', combinedId), { messages: [] })

			await updateDoc(doc(db, 'userChats', currentUser!.uid), {
				[combinedId + '.userInfo']: {
					uid: friend?.uid,
					displayName: friend?.displayName,
					photoURL: friend?.photoURL
				},
				[combinedId + '.date']: serverTimestamp(),
			})

			await updateDoc(doc(db, 'userChats', friend!.uid), {
				[combinedId + '.userInfo']: {
					uid: currentUser?.uid,
					displayName: currentUser?.displayName,
					photoURL: currentUser?.photoURL
				},
				[combinedId + '.date']: serverTimestamp(),
			})
		}

		navigate('/chats')
	}

	return (
		<div className={cl.root}>
			<UsersNavigation allUsers='/users' friends={location.pathname} friendsRequst='../users/friendsRequests' />
			<ul className={cl.friends}>
				<h2 className={cl.usersTitle}>
					Your friends:
					<span>{friends.length}</span>
				</h2>
				{friends.length > 0 ? friends.map((friend) => {
					return (
						<li className={cl.requesterItem} key={friend.uid}>
							<img className={cl.reqImg} src={friend.photoURL} alt='' />
							<div className={cl.reqInfo}>
								<span className={cl.reqName}>{friend.displayName}</span>
								<div className={cl.btns}>
									<Button onClick={() => openChatWithFriend(friend)}>Send a message</Button>
									<Button onClick={() => deleteFriend(friend)}>Delete from friends</Button>
								</div>
							</div>
						</li>
					)
				}) : (
					<div className={cl.emptyFriends}>
						<p>You don't have friends yet.</p>
						<p>But you can send a request to people first in the <span> <NavLink to='/users'>All users</NavLink> </span> section</p>
					</div>
				)}
			</ul>
		</div>
	)
}