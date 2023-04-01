import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'
import storage from 'redux-persist/lib/storage'
import authSlice from './slices/auth-slice/authSlice'
import chatSlice from './slices/chat-slice/chatSlice'
import newsSlice from './slices/news-slice/newsSlice'
import weatherSlice from './slices/weather-slice/weatherSlice'

const persistConfig = {
	key: 'root',
	storage,
}
const rootReducer = combineReducers({
	auth: authSlice,
	news: newsSlice,
	chat: chatSlice,
	weather: weatherSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

const middleware = getDefaultMiddleware({
	immutableCheck: true,
	serializableCheck: false,
	thunk: true,
})

export const store = configureStore({
	reducer: persistedReducer,
	middleware: () => middleware,
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
