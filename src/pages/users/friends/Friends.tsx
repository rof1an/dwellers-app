import { doc, onSnapshot } from 'firebase/firestore'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UsersNavigation } from '../../../components/users/usersNav/UsersNavigation'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import cl from './Friends.module.scss'

export const Friends = () => {
	const location = useLocation()
	const { currentUser } = useAppSelector(state => state.auth)
	const [friends, setFriends] = useState([])

	React.useEffect(() => {
		const unsub = onSnapshot(doc(db, 'userFriends', currentUser!.uid), (doc) => {
			const friendsData = doc.data()?.friends || []
			setFriends(friendsData)
		})

		return () => {
			unsub()
		}
	}, [])

	return (
		<div className={cl.root}>
			<UsersNavigation allUsers='/users' friends={location.pathname} friendsRequst='../users/friendsRequests' />
			<ul>
				{friends.map((friend: any) => {
					return (
						<li key={friend.requesterUid}>{friend.requesterName}</li>
					)
				})}
			</ul>
		</div>
	)
}