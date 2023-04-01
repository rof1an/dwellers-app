import { PayloadAction, createSlice } from '@reduxjs/toolkit'
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

			if (state.currentUser && payload?.uid) {
				state.chatId = payload.uid > state.currentUser.uid
					? payload?.uid + state.currentUser.uid
					: state.currentUser.uid + payload?.uid
			} else {
				state.chatId = ''
			}
		}
	},
})


export const chatState = (state: RootState) => state.chat
export const { setChatInfo, setCurrentUser } = chatSlice.actions
export default chatSlice.reducer
