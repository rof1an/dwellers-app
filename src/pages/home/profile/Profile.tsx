import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useState } from 'react';
import { auth, db } from '../../../firebase';
import { Button } from './../../../components/UI/button/Button';
import { AuthContext } from './../../../context/AuthContext';
import cl from './Profile.module.scss';
import { ProfileModal } from './profileInfoModal/ProfileModal';


export const Profile = () => {
	const [modalVisible, setModalVisible] = useState<boolean>(false)
	const [data, setData] = useState({ city: null, dateOfBirth: null, languages: null });

	//@ts-ignore
	const { currentUser } = useContext(AuthContext)
	const displayName = currentUser.displayName?.replace(/^\w/, (c: string) => c.toUpperCase());



	return (
		<div>
			<div className={cl.mainInfo}>
				<img className={cl.mainImg} src={currentUser.photoURL} />
				<div className={cl.mainAbout}>
					<h2 className={cl.profileTitle}>{displayName}</h2>
					<hr />
					<h3 className={cl.subtitle}>Frontend developer</h3>
					<div className={cl.profileInfo}>
						<div className={cl.left}>
							<p>Date of Birth:</p>
							<p>Languages:</p>
							<p>City:</p>
						</div>
						<div className={cl.right}>
							<p>{data.dateOfBirth}</p>
							<p>{data.languages}</p>
							<p>{data.city}</p>
						</div>
						<Button onClick={() => setModalVisible(true)}>Change information</Button>
					</div>
				</div>
			</div>
			<ProfileModal visible={modalVisible} setVisible={setModalVisible} />
		</div>
	)
}
