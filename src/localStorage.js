const APP_STATE = 'nexusState';
const APP_STATE_VERSION = '1.0';

export const loadAppState = () => {
    try {
        const serializedState = localStorage.getItem(`${APP_STATE}-${APP_STATE_VERSION}`);
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
        localStorage.setItem(`${APP_STATE}-${APP_STATE_VERSION}`, serializedState);
    } catch (e) {}
};
