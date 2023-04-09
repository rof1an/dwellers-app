import { lazy } from 'react'
import { Home } from '../pages/home/Home'
import { Users } from '../pages/users/all-users/Users'
import { FriendsRequests } from '../pages/users/friends-requests/FriendsRequests'
import { Friends } from '../pages/users/friends/Friends'
import { UserPage } from '../pages/users/user-page/UserPage'
import { Weather } from '../pages/weather/Weather'

const Auth = lazy(() =>
	import(/* webpackChunkName: "Auth" */ '../pages/auth/Auth').then((module) => ({
		default: module.Auth,
	}))
)
const Chats = lazy(() =>
	import(/* webpackChunkName: "Chat" */ '../pages/chats/Chats').then((module) => ({
		default: module.Chats,
	}))
)
// const Home = lazy(() => import(/* webpackChunkName: "Home" */"../pages/home/Home").then(module => ({ default: module.Home })));
const News = lazy(() =>
	import(/* webpackChunkName: "News" */ '../pages/news/News').then((module) => ({
		default: module.News,
	}))
)
const NewsId = lazy(() =>
	import(/* webpackChunkName: "NewsId" */ '../pages/news/newsIdPage/NewsId').then((module) => ({
		default: module.NewsId,
	}))
)
const Register = lazy(() =>
	import(/* webpackChunkName: "Register" */ '../pages/register/Register').then((module) => ({
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
	{ path: '/users', Element: Users },
	{ path: '/users/:userId', Element: UserPage },
	{ path: '/users/friends', Element: Friends },
	{ path: '/users/friendsRequests', Element: FriendsRequests },
	{ path: '/weather', Element: Weather }
]
