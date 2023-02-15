import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export type Params = {
    birth: number | null,
    city: string | null,
    languages: string[] | null
}
interface ProfileState {
    params: Params
}

const initialState: ProfileState = {
    params: {
        birth: null,
        city: null,
        languages: null
    }
}

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setParams(state, { payload }: PayloadAction<Params>) {
            state.params = {
                ...state.params, ...payload
            }
        }
    },
})

export const profileSliceState = (state: RootState) => state.auth

export const { setParams } = profileSlice.actions
export default profileSlice.reducer