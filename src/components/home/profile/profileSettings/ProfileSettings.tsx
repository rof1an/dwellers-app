import { useEffect, useState } from 'react'
import cl from './ProfileSettings.module.scss'
import { SettingsItem } from './SettingsItem'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useAppSelector } from '../../../../hooks/hooks'
import { db } from '../../../../firebase'
import deleteImg from '../../../../assets/delete-2-svgrepo-com.svg'
import { default as closedAccSvg, default as privateAcc } from '../../../../assets/icons8-замок.svg'

interface ProfileSettingsProps {
	privateAccount: () => void
	deleteAccount: () => void
	isPrivateAcc: boolean
}

export const ProfileSettings = ({ privateAccount, deleteAccount, isPrivateAcc }: ProfileSettingsProps) => {
	const { currentUser } = useAppSelector(state => state.auth)

	return (
		<ul className={cl.contentList}>
			<SettingsItem
				title='Private account'
				subtitle='Make your account private for other users'
				imgSrc={privateAcc}
				switcherTitle={{ enabled: 'Private', disabled: 'Public' }}
				setSetting={privateAccount}
				isDone={isPrivateAcc}
			/>
			<SettingsItem
				title='Delete an account'
				subtitle='Completely delete the account and all data'
				imgSrc={deleteImg}
				interactiveBtnTitle='Delete'
				setSetting={deleteAccount}
			/>
		</ul>

	)
}
