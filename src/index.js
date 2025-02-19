
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '../src/routes/AuthContext';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/redux/configureStore';
import { Provider } from "react-redux";
import GlobalErrorHandler from '../src/pages/GlobalErrorHandler'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalErrorHandler />
        <AuthProvider>
          <App />
        </AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);




