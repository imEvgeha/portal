import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
// import {store} from '../../../../src';
import {NexusOverlayContext} from '../elements/nexus-overlay/NexusOverlay';
import NexusToastNotification from '../elements/nexus-toast-notification/NexusToastNotification';
import withToasts from './hoc/withToasts';

const Toast = ({toasts, addToast, removeToast}) => {
    const {setIsOverlayActive} = useContext(NexusOverlayContext);

    useEffect(() => {
        const isWithOverlay = toasts.some(toast => toast.isWithOverlay);
        setIsOverlayActive(!!isWithOverlay);
    }, [toasts]);

    return <NexusToastNotification toasts={toasts} addToast={addToast} removeToast={removeToast} />;
};

Toast.propTypes = {
    toasts: PropTypes.array,
    addToast: PropTypes.func.isRequired,
    removeToast: PropTypes.func.isRequired,
};

Toast.defaultProps = {
    toasts: [],
};

export default withToasts(Toast);
