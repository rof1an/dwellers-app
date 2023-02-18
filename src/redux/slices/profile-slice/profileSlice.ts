import { createSlice } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';

interface ProfileData {
	city: string;
	date: string;
	languages: string;
}

interface ProfileState {
	city: string;
	date: string;
	languages: string;
}

export const updateProfile = createAction<ProfileData>('profile/update');

const initialState: ProfileState = {
	city: '',
	date: '',
	languages: '',
};

const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(updateProfile, (state, action) => {
			const { city, date, languages } = action.payload;
			state.city = city;
			state.date = date;
			state.languages = languages;
		});
	},
});

export default profileSlice.reducer;
