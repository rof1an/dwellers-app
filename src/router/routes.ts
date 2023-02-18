import { lazy } from "react";
import { Home } from "../pages/home/Home";

const Auth = lazy(() => import(/* webpackChunkName: "Auth" */"../pages/auth/Auth").then(module => ({ default: module.Auth })));
const Chat = lazy(() => import(/* webpackChunkName: "Chat" */"../pages/chat/Chat").then(module => ({ default: module.Chat })));
// const Home = lazy(() => import(/* webpackChunkName: "Home" */"../pages/home/Home").then(module => ({ default: module.Home })));
const News = lazy(() => import(/* webpackChunkName: "News" */"../pages/news/News").then(module => ({ default: module.News })));
const Register = lazy(() => import(/* webpackChunkName: "Register" */"../pages/register/Register").then(module => ({ default: module.Register })));


export const publicRoutes = [
    { path: '/', Element: Auth },
    { path: '/register', Element: Register },
]

export const privateRoutes = [
    { path: '/', Element: Auth },
    { path: '/register', Element: Register },
    { path: '/home', Element: Home },
    { path: '/chats', Element: Chat },
    { path: '/news', Element: News },
]