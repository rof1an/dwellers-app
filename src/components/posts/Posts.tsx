import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Timestamp, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import React, { useCallback, useState } from 'react'
import 'react-tooltip/dist/react-tooltip.css'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { v4 as uuid } from 'uuid'
import { db } from '../../firebase'
import { useAppSelector } from '../../hooks/hooks'
import { Button } from '../../components/UI/button/Button'
import { Input } from '../../components/UI/input/Input'
import { Loader } from '../../components/UI/loader/Loader'
import './../../index.scss'
import { Post } from './Post'
import cl from './Posts.module.scss'

export type TPost = {
	id: string
	postText: string
	likesCount: number,
	dateId: number,
	postId: string
}

export const Posts = () => {
	const [posts, setPosts] = useState<TPost[]>([])
	const [postText, setPostText] = useState<string | number>('')
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const { currentUser } = useAppSelector(state => state.auth)

	const createPost = async () => {
		const postsRef = doc(db, 'userPosts', currentUser!.uid)
		const docSnapshot = await getDoc(postsRef)
		const data = docSnapshot.data()
		const postsArray = data?.posts || []

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

		await setDoc(postsRef, { posts: updatedPostsArray })
		setPostText('')
	}

	React.useEffect(() => {
		if (currentUser) {
			const unsub = onSnapshot(doc(db, 'userPosts', currentUser.uid), (doc) => {
				const data = doc.data()
				setPosts(data?.posts)
				setIsLoading(false)
			})

			return () => {
				unsub()
			}
		}
	}, [currentUser?.uid])

	const deletePost = useCallback(async (postId: string) => {
		const postsRef = doc(db, 'userPosts', currentUser!.uid)
		const docSnapshot = await getDoc(postsRef)
		const data = docSnapshot.data()

		const postsArray = data?.posts || []
		const updatedPostsArray = postsArray.filter((post: TPost) => post.postId !== postId)
		await setDoc(postsRef, {
			posts: updatedPostsArray
		})
	}, [posts])


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
				<TransitionGroup>
					{posts &&
						posts.map((post: TPost) => {
							const createdAt = new Date(post.dateId)
							const timeAgo = formatDistanceToNow(createdAt, { locale: enUS })

							return (
								<CSSTransition key={post.postId} timeout={400} classNames='trItem'>
									<Post timeAgo={timeAgo} post={post} deletePost={deletePost} />
								</CSSTransition>
							)
						})}
				</TransitionGroup>
			</div>
		</>
	)
}
