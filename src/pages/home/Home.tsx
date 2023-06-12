import { User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IFriend } from '../../@types/users-types'
import defaultAvatar from '../../assets/defaultAvatar.png'
import { Loader } from '../../components/UI/loader/Loader'
import { Posts } from '../../components/home/posts/Posts'
import { Profile } from '../../components/home/profile/Profile'
import { db } from '../../firebase'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useFetching } from '../../hooks/useFetching'
import { setSelectedUser } from '../../redux/slices/users-slice/usersSlice'
import cl from './Home.module.scss'

export const Home = () => {
    const dispatch = useAppDispatch()
    const { currentUser } = useAppSelector(state => state.auth)
    const [friends, setFriends] = useState<IFriend[]>([])
    const [displayedFriends, setDisplayedFriends] = useState<IFriend[]>([])

    const [fetchFriends, loading, error] = useFetching(() => {
        if (currentUser?.uid) {
            return onSnapshot(doc(db, 'userFriends', currentUser.uid), (doc) => {
                const allFriends = doc.data()?.friends
                const randomFriends = allFriends?.sort(() => Math.random() - 0.5).slice(0, 3)

                setFriends(allFriends)
                setDisplayedFriends(randomFriends)
            })
        }
    })

    useEffect(() => {
        fetchFriends()
    }, [currentUser?.uid])


    return (
        <>
            {loading && <Loader />}
            <Profile />
            <div className={cl.infoPart}>
                <Posts />
                <div className={cl.homeFriends}>
                    <span className={cl.friendsTitle}>
                        User friends:
                        <b>{friends?.length > 0 ? ' ' + friends?.length : ' 0'}</b>
                    </span>
                    <ul className={cl.friendsList}>
                        {displayedFriends?.length > 0 ? displayedFriends?.map((friend) => {
                            return (
                                <NavLink
                                    onClick={() => dispatch(setSelectedUser(friend as User))}
                                    to={`/users/${friend.displayName}-${friend.uid}`}
                                    className={cl.friendLink}
                                    key={friend.uid}>
                                    <div className={cl.friend}>
                                        <img src={friend.photoURL} alt="" />
                                        <span>{friend.displayName}</span>
                                    </div>
                                </NavLink>
                            )
                        }) : (
                            <>
                                <li className={cl.noneFriendsLink}>
                                    <NavLink
                                        to={`/users`}
                                    >
                                        <div className={cl.friend}>
                                            <img src={defaultAvatar} alt="" />
                                            <span>+</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className={cl.noneFriendsLink}>
                                    <NavLink
                                        to={`/users`}
                                    >
                                        <div className={cl.friend}>
                                            <img src={defaultAvatar} alt="" />
                                            <span>+</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className={cl.noneFriendsLink}>
                                    <NavLink
                                        to={`/users`}
                                    >
                                        <div className={cl.friend}>
                                            <img src={defaultAvatar} alt="" />
                                            <span>+</span>
                                        </div>
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}
