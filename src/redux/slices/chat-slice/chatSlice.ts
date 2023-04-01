import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { getBothUid } from '../../../utils/getBothUid'
import { RootState } from '../../store'
import { ChatState, UserInfo } from './types'


const initialState: ChatState = {
	chatId: '',
	currentUser: null,
	clickedUser: null
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
		}
	},
})


export const chatState = (state: RootState) => state.chat
export const { setChatInfo, setCurrentUser } = chatSlice.actions
export default chatSlice.reducer
