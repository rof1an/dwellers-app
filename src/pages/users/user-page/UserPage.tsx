import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { UserPosts } from '../../../components/users/user-posts/UserPosts'
import { UserProfile } from '../../../components/users/user-profile/UserProfile'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import cl from './UserPage.module.scss'

export const UserPage = () => {
	const { currentUser } = useAppSelector(state => state.auth)
	const { selectedUser } = useAppSelector(state => state.users)
	const [isAccPrivate, setIsAccPrivate] = useState<boolean>(false)

	useEffect(() => {
		if (selectedUser?.uid) {
			onSnapshot(doc(db, 'userSettings', selectedUser.uid), (doc) => {
				setIsAccPrivate(doc.data()?.isPrivate)
			})
		}
	}, [])

	return (
		<>
			<UserProfile />
			{isAccPrivate ? (
				<div className={cl.privatePosts}>
					<h2>This account is private.</h2>
				</div>
			) : (
				<UserPosts isAccPrivate={isAccPrivate} />
			)}
		</>
	)
}
