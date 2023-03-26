import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NewsService } from '../../../API/NewsService'
import { RootState } from '../../store'
import { News, NewsState, NewsStatusEnums, OneNews } from './types'


export const fetchNews = createAsyncThunk('news/fetchNews', async (params: { page: number }) => {
	const { page } = params
	return NewsService.getAll(page)
	// return data
})

export const fetchNewsById = createAsyncThunk('news/fetchNewsById', async (params: { id: string }) => {
	const { id } = params
	return NewsService.getById(id)
	// return data
})

const initialState: NewsState = {
	news: null,
	oneNews: null,
	status: NewsStatusEnums.LOADING,
}

export const newsSlice = createSlice({
	name: 'news',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchNews.pending, (state) => {
				state.status = NewsStatusEnums.LOADING
			})
			.addCase(fetchNews.fulfilled, (state, { payload }: PayloadAction<News>) => {
				state.status = NewsStatusEnums.FULFILLED
				state.news = payload
			})
			.addCase(fetchNews.rejected, (state) => {
				state.status = NewsStatusEnums.ERROR
			})
			.addCase(fetchNewsById.pending, (state) => {
				state.status = NewsStatusEnums.LOADING
			})
			.addCase(fetchNewsById.fulfilled, (state, { payload }: PayloadAction<OneNews>) => {
				state.status = NewsStatusEnums.FULFILLED
				state.oneNews = payload
			})
			.addCase(fetchNewsById.rejected, (state) => {
				state.status = NewsStatusEnums.ERROR
			})
	},
})

export const newsSliceState = (state: RootState) => state.news
export default newsSlice.reducer
