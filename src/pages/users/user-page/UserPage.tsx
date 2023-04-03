import { UserPosts } from '../../../components/users/user-posts/UserPosts'
import { UserProfile } from '../../../components/users/user-profile/UserProfile'

export const UserPage = () => {
	return (
		<>
			<UserProfile />
			<UserPosts />
		</>
	)
}
