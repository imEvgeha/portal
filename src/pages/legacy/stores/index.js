import {store} from '../../../index';

const DASHBOARD_SESSION_VERSION = '0.5';
const CREATERIGHT_SESSION_VERSION = '0.2';
const HISTORY_SESSION_VERSION = '0.3';
const DOP_SESSION_VERSION = '0.1';
const MANUAL_RIGHT_ENTRY_SESSION_VERSION = '0.1';

export const saveHistoryState = () => {
    saveToWebLocalStorage('history', HISTORY_SESSION_VERSION);
};

export const saveDashboardState = () => {
    saveToWebLocalStorage('dashboard', DASHBOARD_SESSION_VERSION);
};

export const saveCreateRightState = () => {
    saveToWebLocalStorage('createright', CREATERIGHT_SESSION_VERSION);
};

export const saveDopState = () => {
    saveToWebLocalStorage('dopReducer', DOP_SESSION_VERSION);
};

export const saveManualRightEntryState = () => {
    saveToWebLocalStorage('manualRightEntry', MANUAL_RIGHT_ENTRY_SESSION_VERSION);
};

const saveToWebLocalStorage = (name, version) => {
    setTimeout(() => {
        try {
            const serializedState = JSON.stringify(store.getState()[name].session);
            localStorage.setItem(
                'state-' + name + '-' + version + '-' + store.getState().root.profileInfo.email,
                serializedState
            );
        } catch (error) {
            // ignore write errors
        }
    }, 100);
};
