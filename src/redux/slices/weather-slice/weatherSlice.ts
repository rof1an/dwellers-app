import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { WeatherState } from './types'

const initialState: WeatherState = {
	currentCity: null,
	lon: '',
	lat: ''
}

export const weatherSlice = createSlice({
	name: 'weather',
	initialState,
	reducers: {
		setCurrentCity: (state, { payload }: PayloadAction<string>) => {
			state.currentCity = payload
		},
		setCityLat: (state, { payload }: PayloadAction<string>) => {
			state.lat = payload
		},
		setCityLon: (state, { payload }: PayloadAction<string>) => {
			state.lon = payload
		},
	},
})

export const { setCurrentCity, setCityLat, setCityLon } = weatherSlice.actions
export default weatherSlice.reducer
