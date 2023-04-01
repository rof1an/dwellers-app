import { NavLink, useLocation } from 'react-router-dom'
import cl from './UsersNav.module.scss'

interface NavProps {
	friendsRequst: string,
	allUsers: string,
	friends: string,
}

export const UsersNavigation = ({ allUsers, friends, friendsRequst }: NavProps) => {
	const location = useLocation()

	const linkClassName = (path: string) =>
		`${cl.linkItem} ${location.pathname === path ? `${cl.activeLink} ${cl.linkItem}` : `${cl.linkItem}`}`

	return (
		<ul className={cl.linkUl}>
			<NavLink to={friendsRequst} className={friendsRequst && linkClassName(friendsRequst)}>
				<li>My friend requests</li>
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