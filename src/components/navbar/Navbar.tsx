import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import cl from '../navbar/Navbar.module.scss'
import { NavSettings } from './navSettings/NavSettings'

export const Navbar = () => {
	const [isSettingsVisible, setIsSettingsVisible] = useState(false)
	const [links] = useState([
		{ id: 2, title: 'Home', link: '/home' },
		{ id: 3, title: 'News', link: '/news' },
		{ id: 4, title: 'Users', link: '/users' },
		{ id: 5, title: 'Messages', link: '/chats' },
		{ id: 6, title: 'Weather', link: '/weather' },
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
			<ul className={cl.bottomBtn}>
				<li
					onClick={() => setIsSettingsVisible(true)}
					className={cl.bottomLink}>Settings</li>
			</ul>
			<NavSettings isVisible={isSettingsVisible} setIsVisible={setIsSettingsVisible} />
		</div>
	)
}
