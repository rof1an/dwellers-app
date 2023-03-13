import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../firebase'
import { AuthState } from './types'

const initialState: AuthState = {
	isAuth: false,
	currentUser: null,
	isLoading: true,
	error: null,
	status: null,
}

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
	return new Promise((resolve, reject) => {
		const unsub = onAuthStateChanged(auth, (user: any) => {
			if (user) {
				resolve(user)
			} else {
				reject('User not found')
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
		builder.addCase(fetchCurrentUser.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
			state.currentUser = payload
			state.isLoading = false
			state.error = null
		})
		builder.addCase(fetchCurrentUser.rejected, (state, action) => {
			state.currentUser = null
			state.isLoading = false
			state.error = action.error.message
		})
	},
})

export const { setAuth } = authSlice.actions
export default authSlice.reducer
