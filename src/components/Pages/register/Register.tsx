import React, { FC, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import AddAv from '../../../assets/addImg.png'
import errIcon from '../../../assets/error-svgrepo-com.svg'
import { Input } from "../../../components/UI/input/Input"
import { useCreateUser } from '../../../hooks/useCreateUser'
import cl from "../register/Register.module.scss"
import { Button } from './../../../components/UI/button/Button'
import './../../../index.scss'


export const Register: FC = () => {
    const navigate = useNavigate()
    const [error, setError] = useState<boolean>(false)

    const useHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const email = (e.currentTarget[1] as HTMLInputElement).value
        const password = (e.currentTarget[2] as HTMLInputElement).value
        const displayName = (e.currentTarget[0] as HTMLInputElement).value
        const fileInput = e.currentTarget[3] as HTMLInputElement
        const file = fileInput.files !== null && fileInput.files[0]

        try {
            //@ts-ignore
            await useCreateUser({ email, password, file, displayName })
            navigate('/')
        } catch (err) {
            setError(true)
        } finally {
            setTimeout(() => {
                setError(true)
            }, 5000)
        }
    }

    return (
        <div className={cl.form}>
            <h2 className={cl.heading}>Register</h2>
            <form onSubmit={useHandleSubmit} className={cl.inputs}>
                <Input
                    required={true} placeholder='Your nickname' type='text' />
                <Input
                    required={true} placeholder='Your email' type='email' />
                <Input
                    required={true} placeholder='Your password' type='password' />
                <Input style={{ display: 'none' }} type="file" id='file' />
                <label className={cl.formLabel} htmlFor="file">
                    <img src={AddAv} alt="add photo" />
                    <span>Add an avatar</span>
                </label>
                <NavLink to='/'>
                    <p className={cl.haveAcc}>have an account?</p>
                </NavLink>
                <div className={cl.formBtn}>
                    <Button>Create account</Button>
                </div>
            </form>
            {error && (
                <div className='modal'>
                    <img src={errIcon} alt="" />
                    <span>Something went wrong!</span>
                </div>
            )}
        </div>
    )
}
