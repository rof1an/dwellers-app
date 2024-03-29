import React, { FC, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import AddAv from '../../assets/addImg.png'
import { Input } from "../../components/UI/input/Input"
import { Loader } from '../../components/UI/loader/Loader'
import { useAppDispatch } from '../../hooks/hooks'
import { ToastNofify } from '../../utils/ToastNotify'
import cl from "../register/Register.module.scss"
import { Button } from './../../components/UI/button/Button'
import './../../index.scss'
import { createUser } from './functions'


export const Register: FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [isToastDisplayed, setIsToastDisplayed] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isToastDisplayed) {
            return
        }

        setIsLoading(true)
        const email = (e.currentTarget[1] as HTMLInputElement).value
        const password = (e.currentTarget[2] as HTMLInputElement).value
        const displayName = (e.currentTarget[0] as HTMLInputElement).value

        try {
            await createUser({ email, password, img: file, displayName, setError })
            navigate('/')
        } catch (err) {
            setError(true)
            ToastNofify.errorNotify('Something went wrong!')

            setTimeout(() => {
                setError(false)
                setIsToastDisplayed(false)
            }, 1000)
        }
        setIsLoading(false)
    }

    return (
        <>
            {isLoading && <Loader />}
            <ToastContainer />
            <div className={cl.form}>
                <h2 className={cl.heading}>Register</h2>
                <form onSubmit={handleSubmit} className={cl.inputs}>
                    <Input
                        required={true} placeholder='Your nickname' type='text' />
                    <Input
                        required={true} placeholder='Your email' type='email' />
                    <Input
                        required={true} placeholder='Your password' type='password' />
                    <Input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && setFile(e.target.files[0])}
                        style={{ display: 'none' }}
                        type="file" id='file' />
                    <label className={cl.formLabel} htmlFor="file">
                        <img src={AddAv} alt="add photo" />
                        <span>Add an avatar</span>
                    </label>
                    {file && <span className={cl.fileName}>{file.name}</span>}
                    <NavLink to='/'>
                        <p className={cl.haveAcc}>have an account?</p>
                    </NavLink>
                    <div className={cl.formBtn}>
                        <Button>Create account</Button>
                    </div>
                </form>
            </div>
        </>
    )
}
