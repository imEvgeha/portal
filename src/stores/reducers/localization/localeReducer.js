import {
    SET_LOCALE
} from '../../../constants/action-types';
import moment from 'moment';

let localStorageLanguage = localStorage.getItem('localization');

const initialState = {
    locale: localStorageLanguage && localStorageLanguage !== '' && 
            localStorageLanguage === 'en-gb' || 
            localStorageLanguage === 'en-us' ?
                localStorageLanguage.toString().toLowerCase() :
            navigator.language.toString().toLowerCase() !== 'en-gb' && navigator.language.toString().toLowerCase() !== 'en-us' ? 
                moment.locale('en-us') : moment.locale(navigator.language.toString().toLowerCase())
};

const locale = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOCALE:
            return {locale: action.payload};
        default:
            return state;
    }
};

export default locale;