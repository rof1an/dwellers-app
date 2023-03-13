import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../store'
import { ArticlesResponse, NewsState, NewsStatusEnums } from './types'


const api_token = 'Waf2OVrntRDtjqLJOM04B8FxzT5bGqaDjteRT9qd'

export const fetchNews = createAsyncThunk('news/fetchNews', async (params: { page: number }) => {
	const { page } = params
	const { data } = await axios.get('https://api.marketaux.com/v1/news/all?symbols=TSLA,AMZN,MSFT&filter_entities=true&language=en&', {
		params: {
			api_token,
			page,
		},
	})
	return data
})

export const fetchNewsById = createAsyncThunk('news/fetchNewsById', async (params: { id: string }) => {
	const { id } = params
	const { data } = await axios.get(`https://api.marketaux.com/v1/news/uuid/${id}?api_token=${api_token}`)
	return data
})

const initialState: NewsState = {
	news: [],
	status: NewsStatusEnums.LOADING,
}

export const newsSlice = createSlice({
	name: 'news',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchNews.pending, (state) => {
			state.status = NewsStatusEnums.LOADING
		})
		builder.addCase(fetchNews.fulfilled, (state, { payload }: PayloadAction<ArticlesResponse>) => {
			state.status = NewsStatusEnums.FULFILLED
			state.news = payload
		})
		builder.addCase(fetchNews.rejected, (state) => {
			state.status = NewsStatusEnums.ERROR
		})
		builder.addCase(fetchNewsById.pending, (state) => {
			state.status = NewsStatusEnums.LOADING
		})
		builder.addCase(fetchNewsById.fulfilled, (state, { payload }: PayloadAction<ArticlesResponse>) => {
			state.status = NewsStatusEnums.FULFILLED
			state.news = payload
		}
		)
		builder.addCase(fetchNewsById.rejected, (state) => {
			state.status = NewsStatusEnums.ERROR
		})
	},
})

export const newsSliceState = (state: RootState) => state.news
export default newsSlice.reducer
