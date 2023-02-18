import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../store'
import { ArticlesResponse, NewsState, NewsStatusEnums } from './types'

type FetchParams = { page: number }

export const fetchNews = createAsyncThunk('news/fetchNews', async (params: FetchParams) => {
	const { page } = params

	const api_token = 'Waf2OVrntRDtjqLJOM04B8FxzT5bGqaDjteRT9qd';
	const { data } = await axios.get('https://api.marketaux.com/v1/news/all?symbols=TSLA,AMZN,MSFT&filter_entities=true&language=en&', {
		params: {
			api_token,
			page,
		}
	})
	return data
})

const initialState: NewsState = {
	news: [],
	status: NewsStatusEnums.LOADING
}

export const newsSlice = createSlice({
	name: 'news',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchNews.pending, (state) => {
			state.status = NewsStatusEnums.LOADING
		});
		builder.addCase(fetchNews.fulfilled, (state, { payload }: PayloadAction<ArticlesResponse>) => {
			state.status = NewsStatusEnums.FULFILLED
			state.news = payload
		});
		builder.addCase(fetchNews.rejected, (state) => {
			state.status = NewsStatusEnums.ERROR
		})
	}
})

export const newsSliceState = (state: RootState) => state.news

export const { } = newsSlice.actions
export default newsSlice.reducer