
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { AuthProvider } from '../src/routes/AuthContext';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from '../src/redux/configureStore';
// import { Provider } from "react-redux";
// import GlobalErrorHandler from '../src/pages/GlobalErrorHandler'
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <GlobalErrorHandler />
//         <AuthProvider>
//           <App />
//         </AuthProvider>
//       </PersistGate>
//     </Provider>
//   </React.StrictMode>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '../src/routes/AuthContext';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/redux/configureStore';
import { Provider } from "react-redux";
import GlobalErrorHandler from '../src/pages/GlobalErrorHandler';
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

// Import language JSON files
import engLanguage from "../src/languages/English.json";
import gerLanguage from "../src/languages/German.json";
import frLanguage from "../src/languages/French.json";
import itLanguage from "../src/languages/Italian.json";
import esLanguage from "../src/languages/Spanish.json";

// Initialize i18n
i18n.init({
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  debug: true,
  resources: {
    en: { Translate: engLanguage },
    de: { Translate: gerLanguage },
    fr: { Translate: frLanguage },
    it: { Translate: itLanguage },
    es: { Translate: esLanguage },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalErrorHandler />
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);


