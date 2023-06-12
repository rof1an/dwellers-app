import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { FC, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Button } from '../../components/UI/button/Button'
import { Input } from '../../components/UI/input/Input'
import { Loader } from '../../components/UI/loader/Loader'
import { auth } from '../../firebase'
import { useAppDispatch } from '../../hooks/hooks'
import '../../index.scss'
import { setAuth } from '../../redux/slices/auth-slice/authSlice'
import { ToastNofify } from '../../utils/ToastNotify'
import cl from './Auth.module.scss'

export const Auth: FC = React.memo(() => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isToastDisplayed, setIsToastDisplayed] = useState<boolean>(false)
	const [error, setError] = useState<boolean>(false)

	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isToastDisplayed) {
			return
		}

		setIsLoading(true)
		const email = (e.currentTarget[0] as HTMLInputElement).value
		const password = (e.currentTarget[1] as HTMLInputElement).value

		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				dispatch(setAuth(true))
				navigate('/home')
			})
			.catch(() => {
				setError(true)
				ToastNofify.errorNotify('Wrong login or password!')
				setIsToastDisplayed(true)

				setTimeout(() => {
					setIsToastDisplayed(false)
					setError(false)
				}, 1000)
			})
		setIsLoading(false)
	}

	return (
		<>
			{isLoading && <Loader />}
			<ToastContainer />
			<div className={cl.form}>
				<h2 className={cl.heading}>Log In</h2>
				<form onSubmit={handleLogin} className={cl.inputs}>
					<Input placeholder='Your login' type='email' />
					<Input placeholder='Your password' type='password' />
					<NavLink to='/register'>
						<p className={cl.haveAcc}>don't have an account?</p>
					</NavLink>
					<div className={cl.formBtn}>
						<Button>Enter</Button>
					</div>
				</form>
			</div>
		</>
	)
})
