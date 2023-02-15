import { signInWithEmailAndPassword } from "firebase/auth";
import React, { FC, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import errIcon from '../../components/assets/error-svgrepo-com.svg';
import { Button } from "../../components/UI/button/Button";
import { Input } from "../../components/UI/input/Input";
import { auth } from '../../firebase';
import { useAppDispatch } from "../../hooks/hooks";
import { setAuth } from "../../redux/slices/auth-slice/authSlice";
import cl from './Auth.module.scss';



export const Auth: FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [error, setError] = useState<boolean>(false)

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const email = (e.currentTarget[0] as HTMLInputElement).value;
        const password = (e.currentTarget[1] as HTMLInputElement).value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/home')
                dispatch(setAuth(true))
            })
            .catch(() => {
                setError(true)
            });
    }

    return (
        <div className={cl.form}>
            <h2 className={cl.heading}>Log In</h2>
            <form onSubmit={handleLogin} className={cl.inputs}>
                <Input
                    placeholder='Your login' type='email' />
                <Input
                    placeholder='Your password' type='password' />
                <NavLink to='/register'>
                    <p className={cl.haveAcc}>don't have an account?</p>
                </NavLink>
                <div className={cl.formBtn}>
                    <Button>Enter</Button>
                </div>
            </form>
            {error && (
                <div className='modal'>
                    <img src={errIcon} alt="" />
                    <span>Incorrect login or password!</span>
                </div>
            )}
        </div>
    )
})

