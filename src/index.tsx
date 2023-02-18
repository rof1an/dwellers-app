import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from './App';
import { AuthContextProvider } from './context/AuthContext';
import './index.scss';
import { store } from "./redux/store";


let persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthContextProvider>
                    <App />
                </AuthContextProvider>
            </PersistGate>
        </Provider>
    </BrowserRouter>

)
