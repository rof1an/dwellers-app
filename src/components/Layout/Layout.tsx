import React, {memo} from 'react';
import {Header} from "../header/Header";
import {Navbar} from "../navbar/Navbar";
import {Outlet} from "react-router-dom";


export const Layout = () => {
        return (
            <div className="App">
                <Header/>
                <Navbar/>
                <Outlet/>
            </div>
        );
    }


