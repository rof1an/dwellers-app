import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import cl from '../navbar/Navbar.module.scss'

export const Navbar = () => {
	const [links] = useState([
		{ id: 2, title: 'Home', link: '/home' },
		{ id: 3, title: 'News', link: '/news' },
		{ id: 4, title: 'Messages', link: '/chats' },
	])

	return (
		<div className={cl.navigation}>
			<ul className={cl.nav}>
				{links.map((item) => (
					<NavLink
						className={(link) => (link.isActive ? cl.active : '')}
						key={item.id}
						to={item.link}>
						<li>{item.title}</li>
					</NavLink>
				))}
			</ul>
		</div>
	)
}
