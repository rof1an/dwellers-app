import { signOut } from 'firebase/auth';
import { NavLink } from "react-router-dom";
import { auth } from '../../firebase';
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setAuth } from '../../redux/slices/auth-slice/authSlice';
import logo from '../../assets/logo.png';
import logoutIcon from '../../assets/logout-svgrepo-com.svg';
import cl from './Header.module.scss';

export const Header = () => {
    const dispatch = useAppDispatch()
    const { isAuth } = useAppSelector(state => state.auth)

    const signOutFromAccount = () => {
        signOut(auth)
        dispatch(setAuth(false))
    }

    return (
        <div className={cl.header}>
            <div className={cl.headerContent}>
                <NavLink to='/home' className={img => img.isActive ? cl.transformImg : ''}>
                    <div className={cl.headerPanel}>
                        <img className={cl.headerImg} src={logo} />
                        <p>D<span>W</span>ELLE<span>R</span>S</p>
                    </div>
                </NavLink>
                {isAuth ? (
                    <NavLink to='/'>
                        <div className={cl.logout} onClick={signOutFromAccount}>
                            <img src={logoutIcon} />
                            <span>Log out</span>
                        </div>
                    </NavLink>
                ) : (
                    <NavLink to='/'>
                        <div className={cl.login} onClick={signOutFromAccount}>
                            <img src={logoutIcon} />
                            <span>Log in</span>
                        </div>
                    </NavLink>
                )}

            </div>
        </div>
    );
};
