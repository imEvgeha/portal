import {SET_LOCALE} from '../../../constants/action-types';

const localStorageLanguage = localStorage.getItem('localization');
const browserLocale = navigator.language.toString().toLowerCase();
const allowedLocale = ['en-us', 'en-gb'];

const initialState = {
    locale:
        localStorageLanguage && localStorageLanguage !== ''
            ? localStorageLanguage
            : allowedLocale.includes(browserLocale)
            ? browserLocale
            : allowedLocale[0],
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
