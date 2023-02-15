import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TAuthState {
    isAuth: boolean
}


const initialState: TAuthState = {
    isAuth: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, { payload }: PayloadAction<boolean>) {
            state.isAuth = payload
        }
    },
})


export const { setAuth } = authSlice.actions
export default authSlice.reducer