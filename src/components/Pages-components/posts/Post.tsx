import { FC } from 'react'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import deleteIcon from '../../../assets/delete-2-svgrepo-com.svg'
import { useAppSelector } from '../../../hooks/hooks'
import { TPost } from './Posts'
import cl from './Posts.module.scss'

interface PostProps {
	deletePost: (arg: string) => void
	timeAgo: string
	post: TPost
}

export const Post: FC<PostProps> = ({ timeAgo, post, deletePost }) => {
	const currentUser = useAppSelector((state) => state.auth.currentUser)
	const displayName = currentUser?.displayName?.replace(/^\w/, (c: string) => c.toUpperCase())

	return (
		<div className={cl.post}>
			<div>
				<img className={cl.postPhoto} src={currentUser.photoURL} alt='img' />
			</div>
			<div className={cl.postBlock}>
				<div className={cl.postContent}>
					<div className={cl.postAuthor}>
						<h2>{displayName}</h2>
						<span>{timeAgo} ago</span>
					</div>
					<p>{post.postText}</p>
				</div>
				<img
					onClick={() => deletePost(post.postId)}
					className={cl.deleteIcon}
					src={deleteIcon}
					id='delete-post'
				/>
				<Tooltip anchorSelect='#delete-post' place='bottom' content='Delete this post?' />
			</div>
		</div>
	)
}
