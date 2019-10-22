import {
    SET_LOCALE
} from '../../../constants/action-types';

const initialState = {
    locale: localStorage.getItem('localization') && localStorage.getItem('localization') !== '' ? localStorage.getItem('localization').toString().toLowerCase() : window.navigator.language.toString().toLowerCase()
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