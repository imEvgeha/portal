import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Flag, {FlagGroup, AutoDismissFlag} from '@atlaskit/flag';
import NexusToastNotificationContext from './NexusToastNotificationContext';
import {NexusOverlayContext} from '../nexus-overlay/NexusOverlay';

const NexusToastNotification = ({toasts}) => {
    const {removeToast} = useContext(NexusToastNotificationContext);
    const {setIsOverlayActive} = useContext(NexusOverlayContext);
    useEffect(() => {
        const isWithOverlay = toasts.some(toast => toast.isWithOverlay);
        if (isWithOverlay) {
            setIsOverlayActive(true);
        } else {
            setIsOverlayActive(false);
        }
    }, [toasts]);

    return (
        <FlagGroup onDismissed={removeToast}>
            {toasts.map(toast => {
                return toast.autoDismiss ? (
                    <AutoDismissFlag key={toast.id} {...toast} />
                ) : (
                    <Flag key={toast.id} {...toast} />
                );
            })}
        </FlagGroup>
    );
};

NexusToastNotification.propTypes = {
    toasts: PropTypes.array,
};

NexusToastNotification.defaultProps = {
    toasts: [],
};

export default NexusToastNotification;

