import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { App } from './App'
import { Loader } from './components/UI/loader/Loader'
import './index.scss'
import { persistor, store } from './redux/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	//<React.StrictMode>
	<BrowserRouter>
		<Provider store={store}>
			<PersistGate loading={<Loader />} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	</BrowserRouter>
	//</React.StrictMode>
)
