import React, {useState} from 'react';
import NexusToastNotificationContext from './NexusToastNotificationContext';
import NexusToastNotification from './NexusToastNotification';

const NexusToastNotificationProvider = ({children}) => { // eslint-disable-line
    const [toasts, setToasts] = useState([]);
    const addToast = (toast) => setToasts([toast, ...toasts]);
    const removeToast = position => {
        const filteredToasts = position 
            ? toasts.filter((toast, index) => index !== position) 
            : toasts.slice(1);
        setToasts(filteredToasts);
    };

    const context = {
        addToast,
        removeToast,
        toasts,
    };

    return (
        <NexusToastNotificationContext.Provider value={context}>
            <NexusToastNotification toasts={toasts} />
            {children}
        </NexusToastNotificationContext.Provider>
    );
};

export default NexusToastNotificationProvider;

