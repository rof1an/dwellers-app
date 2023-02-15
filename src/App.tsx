import React, { FC } from "react";
import { AppRouter } from "./components/AppRouter";
import { Header } from "./components/header/Header";
import { Navbar } from "./components/navbar/Navbar";
import { useAppSelector } from "./hooks/hooks";

export const App: FC = () => {
    return (
        <div className='App'>
            <Header />
            <Navbar />
            <AppRouter />
        </div>
    )
}


