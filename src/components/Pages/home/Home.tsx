import { Posts } from '../../Pages-components/posts/Posts'
import { Profile } from './profile/Profile'

export const Home = () => {
    return (
        <div>
            <Profile />
            <Posts />
        </div>
    )
}
