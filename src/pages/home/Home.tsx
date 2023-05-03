import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { IFriend } from '../../@types/users-types'
import { Posts } from '../../components/home/posts/Posts'
import { Profile } from '../../components/home/profile/Profile'
import { db } from '../../firebase'
import { useAppSelector } from '../../hooks/hooks'
import cl from './Home.module.scss'

export const Home = () => {
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
                        <b>{friends?.length > 0 ? friends?.length : ' 0'}</b>
                    </span>
                    <ul className={cl.friendsList}>
                        {displayedFriend ? displayedFriend?.map((friend) => {
                            return (
                                <li
                                    key={friend.requesterUid}
                                    className={cl.friend}>
                                    <img src={friend.requesterImg} alt="" />
                                    <span>{friend.requesterName}</span>
                                </li>
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
