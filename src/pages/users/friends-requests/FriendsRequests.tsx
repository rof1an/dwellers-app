import { collection, deleteDoc, doc, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '../../../components/UI/button/Button'
import { UsersNavigation } from '../../../components/users/usersNav/UsersNavigation'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import cl from './FriendsReq.module.scss'

type Recipient = {
	recipientName: string
	recipientUid: string
	recipientImg: string
}
type Requester = {
	requesterName: string
	requesterUid: string
	requesterImg: string
}

interface RequestValues {
	recipient: Recipient
	requester: Requester
}

export const FriendsRequests = () => {
	const location = useLocation().pathname
	const [requests, setRequests] = useState<RequestValues[]>([])
	const { currentUser } = useAppSelector((state) => state.auth)

	React.useEffect(() => {
		getRequests()
	}, [])

	const getRequests = async () => {
		const queryRef = query(
			collection(db, 'friendsRequests'),
			where('recipient.uid', '==', currentUser?.uid)
		)

		onSnapshot(queryRef, (snapshot) => {
			const requestsData: RequestValues[] = []

			snapshot.forEach((doc) => {
				const data = doc.data()
				const request = {
					recipient: {
						recipientName: data.recipient.name,
						recipientUid: data.recipient.uid,
						recipientImg: data.recipient.photoURL,
					},
					requester: {
						requesterName: data.requester.name,
						requesterUid: data.requester.uid,
						requesterImg: data.requester.photoUrl,
					},
				}
				requestsData.push(request as RequestValues)
			})

			setRequests(requestsData)
		})
	}

	const acceptRequest = async (user: Requester) => {
		const reqUid = requests.map((req) => req.requester.requesterUid)
		const docUid = currentUser!.uid > reqUid[0]
			? user?.requesterName + currentUser!.uid + reqUid[0] : user?.requesterName + reqUid[0] + currentUser!.uid

		const userFriendsRef = doc(db, 'userFriends', currentUser!.uid)
		const userFriendsDoc = await getDoc(userFriendsRef)
		const currentFriends = userFriendsDoc.data()?.friends || []
		const updatedFriends = [...currentFriends, user]

		await setDoc(userFriendsRef, { friends: updatedFriends })
		await deleteDoc(doc(db, 'friendsRequests', docUid))

		const updatedRequests = requests.filter((req) => req.requester.requesterUid !== user.requesterUid)
		setRequests(updatedRequests)
	}

	const rejectRequest = () => {

	}

	return (
		<div className={cl.root}>
			<UsersNavigation allUsers='/users' friends='/users/friends' friendsRequst={location} />
			<div className={cl.content}>
				<ul className={cl.requests}>
					<h2>New friend requests</h2>
					{requests.map((req) => {
						return (
							<li className={cl.requesterItem} key={req.requester.requesterUid}>
								<img className={cl.reqImg} src={req.requester.requesterImg} alt='' />
								<div className={cl.reqInfo}>
									<span className={cl.reqName}>{req.requester.requesterName}</span>
									<div className={cl.btns}>
										<Button onClick={() => acceptRequest(req.requester)}>Accept the request</Button>
										<Button>Reject the request</Button>
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
