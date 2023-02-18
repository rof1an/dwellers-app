import React, { FC } from 'react';
import cl from './Input.module.scss'


export const Input = ({ ...props }) => {
    return (
        <input className={cl.input} {...props} />
    );
};

