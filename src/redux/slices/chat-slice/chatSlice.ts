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
		setCurrentUser(state, { payload }: PayloadAction<UserInfo>) {
			state.currentUser = payload
		},
		setChatInfo(state, { payload }: PayloadAction<UserInfo>) {
			state.clickedUser = payload
			if (state.currentUser) {
				state.chatId = payload.uid > state.currentUser.uid
					? payload.uid + state.currentUser.uid
					: state.currentUser?.uid + payload.uid
			}
		}
	},
})


export const chatState = (state: RootState) => state.chat

export const { setChatInfo, setCurrentUser } = chatSlice.actions
export default chatSlice.reducer
