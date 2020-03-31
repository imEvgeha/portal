import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import NexusToastNotification from '../../ui/elements/nexus-toast-notification/NexusToastNotification';
import {NexusOverlayContext} from '../../ui/elements/nexus-overlay/NexusOverlay';
import withToasts from './hoc/withToasts';

const Toast = ({toasts, addToast, removeToast}) => {
    const {setIsOverlayActive} = useContext(NexusOverlayContext);

    useEffect(() => {
        const isWithOverlay = toasts.some(toast => toast.isWithOverlay);
        setIsOverlayActive(!!isWithOverlay);
    }, [toasts]);

    return (
        <NexusToastNotification
            toasts={toasts}
            addToast={addToast}
            removeToast={removeToast}
        />
    );
};

export default withToasts(Toast);
