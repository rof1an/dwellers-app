import React, { FC, PropsWithChildren, ButtonHTMLAttributes } from 'react';
import cl from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: (arg: any) => void
}

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button {...props} className={cl.button}>
            {children}
        </button>
    );
};