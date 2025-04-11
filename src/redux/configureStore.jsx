
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  
import { encryptTransform } from 'redux-persist-transform-encrypt';
import rootReducer from '../redux/reducer';  

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY ; 

const persistConfig = {
    key: 'subtracker', 
    storage,            
    transforms: [
        encryptTransform({
            secretKey: SECRET_KEY,  
            onError: (error) => {
               
                console.error("Encryption error:", error);
            },
        }),
    ],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
