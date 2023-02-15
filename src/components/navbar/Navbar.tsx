import React, {useState} from 'react';
import cl from "../navbar/Navbar.module.scss";
import {NavLink} from "react-router-dom";

export const Navbar = () => {
    const [links, setLinks] = useState([
        {id: 2, title: 'Home', link: '/home'},
        {id: 3, title: 'News', link: '/news'},
        {id: 4, title: 'Messages', link: '/chats'},
    ])

    return (
        <div className={cl.navigation}>
            <ul className={cl.nav}>
                {links.map(item =>
                    <NavLink className={cl.item} key={item.id} to={item.link}>
                        <li>{item.title}</li>
                    </NavLink>
                )}
            </ul>
        </div>
    );
};

