import { doc, onSnapshot } from 'firebase/firestore'
import { FC, useEffect, useState } from "react"
import { AppRouter } from './components/AppRouter'
import { Clock } from './components/UI/clock/Clock'
import { Header } from "./components/header/Header"
import { Navbar } from "./components/navbar/Navbar"
import { db } from './firebase'
import { useAppSelector } from './hooks/hooks'


export const App: FC = () => {
    const [isClockActive, setIsClockActive] = useState(false)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const { currentUser } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (currentUser?.uid) {
            onSnapshot(doc(db, 'userSettings', currentUser.uid), (doc) => {
                setIsClockActive(doc.data()?.clockActive)
            })
        }
    }, [])

    return (
        <div className='App'>
            <Header isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
            <div style={{ display: 'flex' }}>
                <div className={isMobileSidebarOpen ? 'mobileSideBar' : 'sideBar'}>
                    <Navbar />
                    {isClockActive && <Clock />}
                </div>
                <div className='routes'>
                    <AppRouter />
                </div>
            </div>
        </div>
    )
}


