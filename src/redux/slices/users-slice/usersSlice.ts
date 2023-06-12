import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'

interface UserSliceValues {
	selectedUser: User | null
}

const initialState: UserSliceValues = {
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