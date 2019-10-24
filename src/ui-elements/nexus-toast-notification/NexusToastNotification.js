import React, {useState, createContext} from 'react';
import Flag, {FlagGroup, AutoDismissFlag} from '@atlaskit/flag';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Warning from '@atlaskit/icon/glyph/warning';
import {colors} from '@atlaskit/theme';

export const NexusToastNotificationContext = createContext({});

export const NexusToastNotificationProvider = ({children}) => { // eslint-disable-line
    const [toasts, setToasts] = useState([]);
    const addToast = (toast) => {
        let updatedToast = {};
        Object.keys(toast).map(key => {
            if (key === 'icon') {
                updatedToast[key] = iconMap(toast[key]);
            } else {
                updatedToast[key] = toast[key]; 
            }
        });
        setToasts([updatedToast, ...toasts]);
    };

    const removeToast = () => {
        setToasts(toasts.slice(1));
    };

    const context = {
        addToast,
        removeToast,
    };

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
            <FlagGroup onDismissed={removeToast}>
                {toasts.map(toast => {
                    return toast.autoDismiss ? (
                        <AutoDismissFlag key={toast.id} {...toast} />
                    ) : (
                        <Flag key={toast.id} {...toast} />
                    );
                })}
            </FlagGroup>
            {children}
        </NexusToastNotificationContext.Provider>
    );
};

