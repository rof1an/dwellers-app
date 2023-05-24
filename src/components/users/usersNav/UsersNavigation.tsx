import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import cl from './UsersNav.module.scss'

interface NavProps {
	friendsRequst: string,
	allUsers: string,
	friends: string,
}

export const UsersNavigation = ({ allUsers, friends, friendsRequst }: NavProps) => {
	const location = useLocation()
	const { currentUser } = useAppSelector(state => state.auth)
	const [reqCount, setReqCount] = useState<number>(0)

	const linkClassName = (path: string) =>
		`${cl.linkItem} ${location.pathname === path ? `${cl.activeLink} ${cl.linkItem}` : `${cl.linkItem}`}`

	useEffect(() => {
		onSnapshot(doc(db, 'users', currentUser!.uid), (doc) => {
			setReqCount(doc.data()?.requestsReceived)
		})

	}, [])

	return (
		<ul className={cl.linkUl}>
			<NavLink to={friendsRequst}
				className={friendsRequst && linkClassName(friendsRequst)}>
				<li>My friend requests</li>
				{reqCount > 0 ? (
					<span>{reqCount}</span>
				) : (
					''
				)}
			</NavLink>
			<NavLink to={allUsers} className={linkClassName(allUsers)}>
				<li>All users</li>
			</NavLink>
			<NavLink to={friends} className={linkClassName(friends)}>
				<li>My friends</li>
			</NavLink>
		</ul>
	)
}