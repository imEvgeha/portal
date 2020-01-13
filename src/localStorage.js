const APP_STATE = 'nexusState';

export const loadAppState = () => {
    try {
        const serializedState = localStorage.getItem(APP_STATE);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveAppState = state => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(APP_STATE, serializedState);
    } catch (e) {}
};
