
import React, { useEffect } from 'react';
import "../src/assets/style/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from '../src/routes/index';
import { getLanguageCode } from './helper/GetLanguageType'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
function App() {
    const {  i18n } = useTranslation('Translate')
    const userData = useSelector(state => state.userData);
    useEffect(() => {
        i18n.changeLanguage(getLanguageCode(userData?.language));

    }, [userData])


    return (
        <Routes />
    );
}

export default App;

