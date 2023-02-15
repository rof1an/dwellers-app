import { onAuthStateChanged } from "firebase/auth"
import React, { createContext, FC, PropsWithChildren, useState } from "react"
import { auth } from "../firebase"


export const AuthContext = createContext({})

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState({})

	React.useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			user && setCurrentUser(user)
		})

		return () => {
			unsub()
		}
	}, [])

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	)
}

