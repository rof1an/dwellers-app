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
export type Requester = {
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
	const [requestsCount, setRequestsCount] = useState<number>(0)
	const { currentUser } = useAppSelector((state) => state.auth)
	const requesterUid = requests.map((req) => req.requester.requesterUid)

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
			setRequestsCount(requestsData.length)
			setRequests(requestsData)
		})
	}

	const acceptRequest = async (user: Requester) => {
		const senderFriendsRef = doc(db, 'userFriends', user.requesterUid)
		const recipientRef = doc(db, 'userFriends', currentUser!.uid)
		const docUid = currentUser!.uid > requesterUid[0]
			? user?.requesterName + currentUser!.uid + requesterUid[0] : user?.requesterName + requesterUid[0] + currentUser!.uid

		const userFriendsDoc = await getDoc(recipientRef)
		const currentFriends = userFriendsDoc.data()?.friends || []
		const updatedFriends = [...currentFriends, user]

		await setDoc(recipientRef, { friends: updatedFriends })
		await deleteDoc(doc(db, 'friendsRequests', docUid))

		// Add user to the sender's friend list
		const senderFriendsDoc = await getDoc(senderFriendsRef)
		const senderCurrentFriends = senderFriendsDoc.data()?.friends || []
		const senderUpdatedFriends = [...senderCurrentFriends, {
			requesterName: currentUser!.displayName,
			requesterUid: currentUser!.uid,
			requesterImg: currentUser!.photoURL,
		}]

		await setDoc(senderFriendsRef, { friends: senderUpdatedFriends })
		const updatedRequests = requests.filter((req) => req.requester.requesterUid !== user.requesterUid)
		setRequests(updatedRequests)
	}

	const rejectRequest = async (user: Requester) => {
		const docUid = currentUser!.uid > requesterUid[0]
			? user?.requesterName + currentUser!.uid + requesterUid[0] : user?.requesterName + requesterUid[0] + currentUser!.uid
		await deleteDoc(doc(db, 'friendsRequests', docUid))
	}

	return (
		<div className={cl.root}>
			<UsersNavigation allUsers='/users' friends='/users/friends' friendsRequst={location} />
			<div className={cl.content}>
				<ul className={cl.requests}>
					<h2>
						New friend requests
						<span>{requestsCount}</span>
					</h2>
					{requests.map((req) => {
						return (
							<li className={cl.requesterItem} key={req.requester.requesterUid}>
								<img className={cl.reqImg} src={req.requester.requesterImg} alt='' />
								<div className={cl.reqInfo}>
									<span className={cl.reqName}>{req.requester.requesterName}</span>
									<div className={cl.btns}>
										<Button onClick={() => acceptRequest(req.requester)}>Accept the request</Button>
										<Button onClick={() => rejectRequest(req.requester)}>Reject the request</Button>
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
