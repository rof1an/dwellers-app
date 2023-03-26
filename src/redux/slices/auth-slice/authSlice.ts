import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../../../firebase'
import { AuthState, CurrUser } from './types'

const initialState: AuthState = {
	isAuth: false,
	currentUser: null,
	isLoading: true,
	error: '',
	status: '',
}

export const fetchCurrentUser = createAsyncThunk<User>('auth/fetchCurrentUser', async () => {
	return new Promise((resolve) => {
		const unsub = onAuthStateChanged(auth, (user) => {
			if (user) {
				resolve(user)
			}
			unsub()
		})
	})
})

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuth(state, { payload }: PayloadAction<boolean>) {
			state.isAuth = payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCurrentUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.currentUser = action.payload
				state.isLoading = false
				state.error = null
			})
			.addCase(fetchCurrentUser.rejected, (state, action) => {
				state.currentUser = null
				state.isLoading = false
				state.error = action.error.message
			})
	},
})

export const { setAuth } = authSlice.actions
export default authSlice.reducer
