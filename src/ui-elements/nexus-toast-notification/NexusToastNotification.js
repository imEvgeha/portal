import React, {useEffect, useContext, isValidElement} from 'react';
import PropTypes from 'prop-types';
import Flag, {FlagGroup, AutoDismissFlag} from '@atlaskit/flag';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Warning from '@atlaskit/icon/glyph/warning';
import {colors} from '@atlaskit/theme';
import NexusToastNotificationContext from './NexusToastNotificationContext';
import {NexusOverlayContext} from '../nexus-overlay/NexusOverlay';
import {switchCase} from '../../util/Common';
import {
    SUCCESS_ICON,
    WARNING_ICON,
    INFO_ICON,
    ERROR_ICON,
} from './constants';

const icons = {
    [INFO_ICON]: <Info label={`${INFO_ICON} icon`} primaryColor={colors.P300} />,
    [SUCCESS_ICON]: <Tick label={`${SUCCESS_ICON} icon`} primaryColor={colors.G300} />,
    [WARNING_ICON]: <Warning label={`${WARNING_ICON} icon`} primaryColor={colors.Y300} />,
    [ERROR_ICON]: <Error label={`${ERROR_ICON} icon`} primaryColor={colors.R300} />,
};

let NexusToastNotification = ({toasts}) => {
    const {removeToast} = useContext(NexusToastNotificationContext);
    const {setIsOverlayActive} = useContext(NexusOverlayContext);
    useEffect(() => {
        const isWithOverlay = toasts.some(toast => toast.isWithOverlay);
        setIsOverlayActive(!!isWithOverlay);
    }, [toasts]);

    return (
        <FlagGroup onDismissed={removeToast}>
            {toasts.map((toast, index) => {
                const updatedToast = {
                    ...toast,
                    ...(toast.icon 
                        && !isValidElement(toast.icon) 
                        && {icon: switchCase(icons)(icons[INFO_ICON])(toast.icon)}
                    ),
                };
                return toast.isAutoDismiss ? (
                    <AutoDismissFlag key={index} {...updatedToast} />
                ) : (
                    <Flag key={index} {...updatedToast} />
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

export default React.memo(NexusToastNotification);

