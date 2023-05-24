import { collection, deleteDoc, doc, getDoc, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '../../../components/UI/button/Button'
import { UsersNavigation } from '../../../components/users/usersNav/UsersNavigation'
import { db } from '../../../firebase'
import { useAppSelector } from '../../../hooks/hooks'
import cl from './FriendsReq.module.scss'

type Recipient = {
	displayName: string
	uid: string
	photoURL: string
}
export type Requester = {
	displayName: string
	uid: string
	photoURL: string
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
	const requesterUid = requests.map((req) => req.requester.uid)

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
						displayName: data.recipient.name,
						uid: data.recipient.uid,
						photoURL: data.recipient.photoURL,
					},
					requester: {
						displayName: data.requester.name,
						uid: data.requester.uid,
						photoURL: data.requester.photoUrl,
					},
				}
				requestsData.push(request as RequestValues)
			})
			setRequests(requestsData)
			setRequestsCount(requestsData.length)

			updateDoc(doc(db, 'users', currentUser!.uid), {
				requestsReceived: requestsData?.length
			})
		})
	}

	const acceptRequest = async (user: Requester) => {
		const senderFriendsRef = doc(db, 'userFriends', user.uid)
		const recipientRef = doc(db, 'userFriends', currentUser!.uid)
		const docUid = currentUser!.uid > requesterUid[0]
			? user?.displayName + currentUser!.uid + requesterUid[0] : user?.displayName + requesterUid[0] + currentUser!.uid

		const userFriendsDoc = await getDoc(recipientRef)
		const currentFriends = userFriendsDoc.data()?.friends || []
		console.log('currFriends', currentFriends)
		console.log(user)
		const updatedFriends = [...currentFriends, user]

		await setDoc(recipientRef, { friends: updatedFriends })
		await deleteDoc(doc(db, 'friendsRequests', docUid))

		// Add user to the sender's friend list
		const senderFriendsDoc = await getDoc(senderFriendsRef)
		const senderCurrentFriends = senderFriendsDoc.data()?.friends || []
		const senderUpdatedFriends = [...senderCurrentFriends, {
			displayName: currentUser!.displayName,
			uid: currentUser!.uid,
			photoURL: currentUser!.photoURL,
		}]

		await setDoc(senderFriendsRef, { friends: senderUpdatedFriends })
		const updatedRequests = requests.filter((req) => req.requester.uid !== user.uid)
		setRequests(updatedRequests)
	}

	const rejectRequest = async (user: Requester) => {
		const docUid = currentUser!.uid > requesterUid[0]
			? user?.displayName + currentUser!.uid + requesterUid[0] : user?.displayName + requesterUid[0] + currentUser!.uid
		await deleteDoc(doc(db, 'friendsRequests', docUid))
	}

	return (
		<div className={cl.root}>
			<UsersNavigation allUsers='/users' friends='/users/friends' friendsRequst={location} />
			<div className={cl.content}>
				<ul className={cl.requests}>
					<h2>
						New friend requests:
						<span>{requestsCount}</span>
					</h2>
					{requests.length > 0 ? requests.map((req) => {
						return (
							<li className={cl.requesterItem} key={req.requester.uid}>
								<img className={cl.reqImg} src={req.requester.photoURL} alt='' />
								<div className={cl.reqInfo}>
									<span className={cl.reqName}>{req.requester.displayName}</span>
									<div className={cl.btns}>
										<Button onClick={() => acceptRequest(req.requester)}>Accept the request</Button>
										<Button onClick={() => rejectRequest(req.requester)}>Reject the request</Button>
									</div>
								</div>
							</li>
						)
					}) : (
						<div className={cl.emptyRequests}>
							<p>There are no requests for friends yet.</p>
							<p>You can be the first to send it in the <span> <NavLink to='/users'>All users</NavLink> </span> section.</p>
						</div>
					)}
				</ul>
			</div>
		</div>
	)
}
