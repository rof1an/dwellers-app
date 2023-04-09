import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { getBothUid } from '../../../utils/getBothUid'
import { RootState } from '../../store'
import { ChatState, UserInfo } from './types'


const initialState: ChatState = {
	chatId: '',
	currentUser: null,
	clickedUser: null,
	lastSender: null
}

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setCurrentUser(state, { payload }: PayloadAction<UserInfo | null>) {
			state.currentUser = payload
		},
		setChatInfo(state, { payload }: PayloadAction<UserInfo | null>) {
			state.clickedUser = payload

			if (state.currentUser && state.clickedUser && payload?.uid) {
				state.chatId = getBothUid.getUid(payload?.uid, state.currentUser?.uid)
			} else {
				state.chatId = ''
			}
		},
		setLastSender: (state, { payload }) => {
			state.lastSender = payload
		}
	},
})


export const chatState = (state: RootState) => state.chat
export const { setChatInfo, setCurrentUser, setLastSender } = chatSlice.actions
export default chatSlice.reducer
