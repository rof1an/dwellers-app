import { PropsWithChildren, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppSelector } from '../hooks/hooks';
import { privateRoutes, publicRoutes } from "../router/routes";
import { Loader } from './loader/Loader';

export const AppRouter = () => {
    const { isAuth } = useAppSelector(state => state.auth)


    return (
        <Suspense fallback={<Loader />}>
            {isAuth ? (
                <Routes>
                    {privateRoutes.map(({ path, Element }) =>
                        <Route key={path} path={path} element={<Element />} />
                    )}
                </Routes>
            ) : (
                <Routes>
                    {publicRoutes.map(({ path, Element }) =>
                        <Route key={path} path={path} element={<Element />} />
                    )}
                </Routes>
            )}
        </Suspense>
    )
}

