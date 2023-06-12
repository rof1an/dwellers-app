import { signOut } from 'firebase/auth'
import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import logoutIcon from '../../assets/logout-svgrepo-com.svg'
import { auth } from '../../firebase'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setAuth } from '../../redux/slices/auth-slice/authSlice'
import cl from './Header.module.scss'

interface HeaderProps {
	setIsMobileSidebarOpen: (arg: boolean) => void
	isMobileSidebarOpen: boolean
}

export const Header = ({ setIsMobileSidebarOpen, isMobileSidebarOpen }: HeaderProps) => {
	const dispatch = useAppDispatch()
	const burgerMenuRef = useRef<HTMLDivElement>(null)
	const { isAuth } = useAppSelector((state) => state.auth)
	const { currentUser } = useAppSelector(state => state.auth)

	const signOutFromAccount = () => {
		dispatch(setAuth(false))
		signOut(auth)
			.then(() => {
				dispatch(setAuth(false))
				localStorage.removeItem('persist:root')
			})
	}

	const openSidebar = () => {
		if (burgerMenuRef.current) {
			setIsMobileSidebarOpen(!isMobileSidebarOpen)
		}
	}

	return (
		<header className={cl.header}>
			<div className={cl.headerContent}>
				<div
					onClick={() => openSidebar()}
					ref={burgerMenuRef} className="burger">
					<div className="bar1"></div>
					<div className="bar2"></div>
					<div className="bar3"></div>
				</div>
				<NavLink to='/home' className={(img) => (img.isActive ? cl.transformImg : '')}>
					<div className={cl.headerPanel}>
						<img className={cl.headerImg} src={logo} />
						<p>
							D<span>W</span>ELLE<span>R</span>S
						</p>
					</div>
				</NavLink>
				{isAuth ? (
					<div className={cl.logInfo}>
						<NavLink to='/'>
							<div className={cl.logout} onClick={signOutFromAccount}>
								<img src={logoutIcon} />
								<span>Log out</span>
							</div>
						</NavLink>
						{currentUser?.photoURL && <img className={cl.logo} src={currentUser.photoURL} />}
					</div>
				) : (
					<NavLink to='/'>
						<div className={cl.login} onClick={signOutFromAccount}>
							<img src={logoutIcon} />
							<span>Log in</span>
						</div>
					</NavLink>
				)}
			</div>
		</header>
	)
}
