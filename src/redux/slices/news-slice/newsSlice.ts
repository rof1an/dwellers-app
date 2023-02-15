import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../store'
import { NewsData, NewsState, NewsStatusEnums } from './types'

type FetchParams = {
	pageSize: number
}

export const fetchNews = createAsyncThunk('news/fetchNews', async (params: FetchParams) => {
	const { pageSize } = params
	const { data } = await axios.get<NewsData>('https://newsapi.org/v2/everything?q=tesla&from=2023-01-14&sortBy=publishedAt&apiKey=c12870d8ad054d1998726ca54264ccb5', {
		params: {
			pageSize: pageSize
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
		builder.addCase(fetchNews.fulfilled, (state, { payload }) => {
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