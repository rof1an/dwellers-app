import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from '../hooks/hooks'
import { privateRoutes, publicRoutes } from '../routes/routes'
import { Loader } from './UI/loader/Loader'

export const AppRouter = () => {
	const { isAuth } = useAppSelector((state) => state.auth)

	return (
		<Suspense fallback={<Loader />}>
			<Routes>
				{publicRoutes.map(({ path, Element }) => (
					<Route key={path} path={path} element={
						isAuth ? (
							<Navigate to="/home" replace={true} />
						) : (
							<Element />
						)
					} />
				))}
				{privateRoutes.map(({ path, Element }) => (
					<Route
						key={path}
						path={path}
						element={
							isAuth ? (
								<Element />
							) : (
								<Navigate to="/" replace={true} />
							)
						}
					/>
				))}
			</Routes>
		</Suspense>
	)
}
