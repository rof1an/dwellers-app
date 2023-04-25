import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Timestamp, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-tooltip/dist/react-tooltip.css'
import { v4 as uuid } from 'uuid'
import { TPost } from '../../../@types/home-types'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import { Button } from '../../UI/button/Button'
import { Input } from '../../UI/input/Input'
import { Loader } from '../../UI/loader/Loader'
import './../../../index.scss'
import { Post } from './Post'
import cl from './Posts.module.scss'

export const Posts = () => {
	const [posts, setPosts] = useState<TPost[]>([])
	const [postText, setPostText] = useState<string | number>('')
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const { currentUser } = useAppSelector((state) => state.auth)

	const createPost = async () => {
		const postsRef = doc(db, 'userPosts', currentUser!.uid)
		const docSnapshot = await getDoc(postsRef)
		const data = docSnapshot.data()
		const postsArray: TPost[] = data?.posts || []

		const uid = uuid()
		const newPost = {
			userId: currentUser!.uid,
			postId: uid,
			dateId: Date.now(),
			postText,
			likesCount: 0,
			date: Timestamp.now(),
		}
		const updatedPostsArray = [newPost, ...postsArray]
		if (postText) {
			await setDoc(postsRef, { posts: updatedPostsArray })
			setPostText('')
		}
	}

	React.useEffect(() => {
		if (currentUser) {
			const getPosts = onSnapshot(doc(db, 'userPosts', currentUser.uid), (doc) => {
				const data = doc.data()
				setPosts(data?.posts)
			})
			setIsLoading(false)

			return () => getPosts()
		}
	}, [currentUser?.uid])

	const deletePost = async (postId: string) => {
		const postsRef = doc(db, 'userPosts', currentUser!.uid)
		const docSnapshot = await getDoc(postsRef)
		const data = docSnapshot.data()

		const postsArray = data?.posts
		const updatedPostsArray = postsArray.filter((post: TPost) => post.postId !== postId)
		await updateDoc(postsRef, {
			posts: updatedPostsArray,
		})
		setPosts(updatedPostsArray)
	}

	return (
		<>
			{isLoading && <Loader />}
			<div className={cl.posts}>
				<div className={cl.postInput}>
					<Input
						value={postText}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostText(e.target.value)}
						placeholder='Share your news..'
					/>
					<Button onClick={createPost}>Create post</Button>
				</div>
				<div className={cl.postsBlock}>
					<div className={cl.postsSwitchersBtn}>
						<span>All posts</span>
						<span>My posts</span>
					</div>
					<hr style={{ borderColor: 'rgb(204 204 204 / 18%)' }} />

					{posts?.length > 0 ?
						posts.map((post: TPost) => {
							const createdAt = new Date(post.dateId)
							const timeAgo = formatDistanceToNow(createdAt, { locale: enUS })

							return (
								<Post key={post.postId} timeAgo={timeAgo} post={post} deletePost={deletePost} />
							)
						}) : (
							<div className={cl.empty}>
								<div className={cl.emptyPostsSvg}>
									<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="newsfeed_outline_56__Icons-56/newsfeed_outline_56" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="newsfeed_outline_56__newsfeed_outline_56"><path d="M0 0h56v56H0z"></path><path d="M20.32 6H35.1c3.73.03 5.68.37 7.57 1.3l.42.21c1.9 1.01 3.39 2.5 4.4 4.4 1.04 1.96 1.45 3.85 1.5 7.58l.01.83V35.5c-.06 3.73-.47 5.62-1.51 7.58a10.59 10.59 0 0 1-4.4 4.4c-1.96 1.04-3.85 1.45-7.58 1.5l-.83.01H19.5c-3.73-.06-5.62-.47-7.58-1.51a10.59 10.59 0 0 1-4.4-4.4c-1.04-1.96-1.45-3.85-1.5-7.58L6 34.68V19.9c.03-3.73.37-5.68 1.3-7.57l.21-.42c1.01-1.9 2.5-3.39 4.4-4.4 1.96-1.04 3.85-1.45 7.58-1.5l.83-.01ZM46 20.91a1.5 1.5 0 0 1-.5.09h-36a1.5 1.5 0 0 1-.5-.09v14.51c.04 3.3.36 4.76 1.16 6.26a7.59 7.59 0 0 0 3.16 3.16c1.5.8 2.95 1.12 6.26 1.16h15.84c3.3-.04 4.76-.36 6.26-1.16a7.59 7.59 0 0 0 3.16-3.16c.8-1.5 1.12-2.95 1.16-6.26v-.74ZM34.68 9h-15.1c-3.3.04-4.76.36-6.26 1.16a7.59 7.59 0 0 0-3.16 3.16c-.67 1.25-1 2.47-1.11 4.75.14-.05.3-.07.45-.07h36c.16 0 .3.02.45.07-.11-2.28-.44-3.5-1.1-4.75a7.59 7.59 0 0 0-3.17-3.16c-1.6-.86-3.16-1.16-7-1.16Z" id="newsfeed_outline_56__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg>
								</div>
								<div className={cl.emptyTitle}>There are no one post yet</div>
							</div>
						)}
				</div>
			</div>
		</>
	)
}
