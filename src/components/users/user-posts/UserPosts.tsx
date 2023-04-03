import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { doc, onSnapshot } from 'firebase/firestore'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { TPost } from '../../../@types/home-types'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import { Loader } from '../../UI/loader/Loader'
import { UserPost } from './UserPost'
import cl from './UserPosts.module.scss'

export const UserPosts = () => {
	const [posts, setPosts] = useState([])
	const { selectedUser } = useAppSelector(state => state.users)
	const [isLoading, setIsLoading] = useState(false)

	React.useEffect(() => {
		if (selectedUser) {
			const unsub = onSnapshot(doc(db, 'userPosts', selectedUser.uid), (doc) => {
				const data = doc.data()
				setPosts(data?.posts)
			})
			setIsLoading(false)

			return () => {
				unsub()
			}
		}
	}, [selectedUser?.uid])

	return (
		<>
			{isLoading && <Loader />}
			<div className={cl.posts}>
				{posts &&
					posts.map((post: TPost) => {
						const createdAt = new Date(post.dateId)
						const timeAgo = formatDistanceToNow(createdAt, { locale: enUS })

						return (
							<motion.div
								key={post.id}
								initial={{ height: 0 }}
								animate={{ height: 'auto' }}
								transition={{ duration: 0.4 }}
							>
								<UserPost post={post} timeAgo={timeAgo} selectedUser={selectedUser} />
							</motion.div>
						)
					})}
			</div >
		</>
	)
}
