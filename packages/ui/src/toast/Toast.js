import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {NexusOverlayContext} from '../elements/nexus-overlay/NexusOverlay';
import NexusToastNotification from '../elements/nexus-toast-notification/NexusToastNotification';
import withToasts from './hoc/withToasts';

const Toast = ({toasts, removeToast}) => {
    const {setIsOverlayActive} = useContext(NexusOverlayContext);

    useEffect(() => {
        const isWithOverlay = toasts.some(toast => toast.isWithOverlay);
        setIsOverlayActive(!!isWithOverlay);
    }, [toasts]);

    return <NexusToastNotification toasts={toasts} removeToast={removeToast} />;
};

Toast.propTypes = {
    toasts: PropTypes.array,
    removeToast: PropTypes.func.isRequired,
};

Toast.defaultProps = {
    toasts: [],
};

export default withToasts(Toast);
