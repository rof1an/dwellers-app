import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'

interface SliceValues {
	selectedUser: User | null
}

const initialState: SliceValues = {
	selectedUser: null
}

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setSelectedUser: (state, { payload }: PayloadAction<User>) => {
			state.selectedUser = payload
		}
	}
})
export const { setSelectedUser } = usersSlice.actions
export default usersSlice.reducer