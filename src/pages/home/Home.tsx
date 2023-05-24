import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IFriend } from '../../@types/users-types'
import { Posts } from '../../components/home/posts/Posts'
import { Profile } from '../../components/home/profile/Profile'
import { db } from '../../firebase'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import cl from './Home.module.scss'
import { setSelectedUser } from '../../redux/slices/users-slice/usersSlice'
import { User } from 'firebase/auth'

export const Home = () => {
    const dispatch = useAppDispatch()
    const { currentUser } = useAppSelector(state => state.auth)
    const [friends, setFriends] = useState<IFriend[]>([])
    const [displayedFriend, setDisplayedFriend] = useState<IFriend[]>([])

    useEffect(() => {
        if (currentUser?.uid) {
            const getFriends = onSnapshot(doc(db, 'userFriends', currentUser.uid), (doc) => {
                const allFriends = doc.data()?.friends
                const randomFriends = allFriends?.sort(() => Math.random() - 0.5).slice(0, 3)

                setFriends(allFriends)
                setDisplayedFriend(randomFriends)
            })

            return () => {
                getFriends()
            }
        }
    }, [])


    return (
        <>
            <Profile />
            <div className={cl.infoPart}>
                <Posts />
                <div className={cl.homeFriends}>
                    <span className={cl.friendsTitle}>
                        User friends:
                        <b>{friends?.length > 0 ? ' ' + friends?.length : ' 0'}</b>
                    </span>
                    <ul className={cl.friendsList}>
                        {displayedFriend ? displayedFriend?.map((friend) => {
                            console.log(friend)
                            dispatch(setSelectedUser(friend as User))

                            return (
                                <NavLink to={`/users/${friend.displayName}-${friend.uid}`}
                                    className={cl.friendLink}
                                    key={friend.uid}>
                                    <li className={cl.friend}>
                                        <img src={friend.photoURL} alt="" />
                                        <span>{friend.displayName}</span>
                                    </li>
                                </NavLink>
                            )
                        }) : (
                            <div>
                                There are no one friend yet
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}
