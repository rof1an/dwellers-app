import { FC } from "react"
import { AppRouter } from './components/AppRouter'
import { Header } from "./components/header/Header"
import { Navbar } from "./components/navbar/Navbar"


export const App: FC = () => {
    return (
        <div className='App'>
            <Header />
            <Navbar />
            <div className='routes'>
                <AppRouter />
            </div>
        </div>
    )
}


