import { User } from 'firebase/auth'
import { TPost } from '../../../@types/home-types'
import cl from './UserPosts.module.scss'

interface IUserPost {
	post: TPost,
	timeAgo: string,
	selectedUser: User | null
}

export const UserPost = ({ post, timeAgo, selectedUser }: IUserPost) => {
	return (
		<div className={cl.post}>
			<div>
				{selectedUser?.photoURL && <img className={cl.postPhoto} src={selectedUser.photoURL} alt='img' />}
			</div>
			<div className={cl.postBlock}>
				<div className={cl.postContent}>
					<div className={cl.postAuthor}>
						<h2>{selectedUser?.displayName}</h2>
						<span>{timeAgo} ago</span>
					</div>
					<p>{post.postText}</p>
				</div>
			</div>
		</div>
	)
}
