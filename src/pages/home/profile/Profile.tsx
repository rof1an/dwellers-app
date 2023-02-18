import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import changeSvg from '../../../assets/edit-svgrepo-com.svg';
import { db } from '../../../firebase';
import { Loader } from './../../../components/loader/Loader';
import { Button } from './../../../components/UI/button/Button';
import { AuthContext } from './../../../context/AuthContext';
import cl from './Profile.module.scss';
import { ProfileModal } from './profileModal/ProfileModal';


export const Profile = () => {
	const [modalVisible, setModalVisible] = useState<boolean>(false)
	const [data, setData] = useState({ city: '', date: '', languages: '' });
	const [loading, setLoading] = useState<boolean>(true);

	//@ts-ignore
	const { currentUser } = useContext(AuthContext)
	const displayName = currentUser?.displayName?.replace(/^\w/, (c: string) => c.toUpperCase());


	React.useEffect(() => {
		if (currentUser.uid) {
			const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc: any) => {
				setData({
					...data,
					...doc.data()
				});
				setLoading(false);
			});

			return () => {
				unsub()
			}
		}
	}, [currentUser])

	if (loading) {
		return <Loader />
	}

	return (
		<div>
			<div className={cl.mainInfo}>
				<img className={cl.mainImg} src={currentUser?.photoURL} />
				<div className={cl.mainAbout}>
					<h2 className={cl.profileTitle}>{displayName}</h2>
					<hr />
					<h3 className={cl.subtitle}>
						<img src={changeSvg} alt="#" />
						<p>Frontend developer</p>
					</h3>
					<div className={cl.profileInfo}>
						<div className={cl.left}>
							<p>Date of Birth:</p>
							<p>Languages:</p>
							<p>City:</p>
						</div>
						<div className={cl.right}>
							<p>{data.date}</p>
							<p>{data.languages}</p>
							<p>{data.city}</p>
						</div>
						<Button onClick={() => setModalVisible(true)}>Change information</Button>
					</div>
				</div>
			</div>
			<ProfileModal
				value={data} setValue={setData}
				visible={modalVisible} setVisible={setModalVisible} />
		</div>
	)
}
