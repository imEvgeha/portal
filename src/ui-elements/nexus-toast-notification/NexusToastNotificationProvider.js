import React, {useState} from 'react';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Warning from '@atlaskit/icon/glyph/warning';
import {colors} from '@atlaskit/theme';
import NexusToastNotificationContext from './NexusToastNotificationContext';
import NexusToastNotification from './NexusToastNotification';

const NexusToastNotificationProvider = ({children}) => { // eslint-disable-line
    const [toasts, setToasts] = useState([]);
    const addToast = (toast) => {
        // TODO: move this to NexusToastNotification
        const updatedToast = Object.keys(toast).reduce((object, key) => {
            const value = toast[key];
            if (key === 'icon') {
                object[key] = iconMap(value); 
            } else {
                object[key] = value;
            }
            return object;
        }, {id: toasts.length});
        setToasts([updatedToast, ...toasts]);
    };

    const removeToast = () => {
        setToasts(toasts.slice(1));
    };

    const context = {
        addToast,
        removeToast,
        toasts,
    };

    // TODO: move to NexusToastNotification
    const iconMap = (key, color) => {
        const icons = {
            info: <Info label="Info icon" primaryColor={color || colors.P300} />,
            success: <Tick label="Success icon" primaryColor={color || colors.G300} />,
            warning: <Warning label="Warning icon" primaryColor={color || colors.Y300} />,
            error: <Error label="Error icon" primaryColor={color || colors.R300} />,
        };
    
        return key ? icons[key] : icons;
    };

    return (
        <NexusToastNotificationContext.Provider value={context}>
            <NexusToastNotification toasts={toasts} />
            {children}
        </NexusToastNotificationContext.Provider>
    );
};

export default NexusToastNotificationProvider;

