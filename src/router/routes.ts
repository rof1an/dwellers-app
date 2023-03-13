import { lazy } from 'react'
import { Home } from '../components/Pages/home/Home'

const Auth = lazy(() =>
	import(/* webpackChunkName: "Auth" */ '../components/Pages/auth/Auth').then((module) => ({
		default: module.Auth,
	}))
)
const Chats = lazy(() =>
	import(/* webpackChunkName: "Chat" */ '../components/Pages/chats/Chats').then((module) => ({
		default: module.Chats,
	}))
)
// const Home = lazy(() => import(/* webpackChunkName: "Home" */"../pages/home/Home").then(module => ({ default: module.Home })));
const News = lazy(() =>
	import(/* webpackChunkName: "News" */ '../components/Pages/news/News').then((module) => ({
		default: module.News,
	}))
)
const NewsId = lazy(() =>
	import(/* webpackChunkName: "NewsId" */ '../components/Pages/news/newsIdPage/NewsId').then((module) => ({
		default: module.NewsId,
	}))
)
const Register = lazy(() =>
	import(/* webpackChunkName: "Register" */ '../components/Pages/register/Register').then((module) => ({
		default: module.Register,
	}))
)

export const publicRoutes = [
	{ path: '/', Element: Auth },
	{ path: '/register', Element: Register },
]

export const privateRoutes = [
	{ path: '/home', Element: Home },
	{ path: '/', Element: Auth },
	{ path: '/register', Element: Register },
	{ path: '/chats', Element: Chats },
	{ path: '/news', Element: News },
	{ path: '/news/:id', Element: NewsId },
]
