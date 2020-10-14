import React, {isValidElement} from 'react';
import PropTypes from 'prop-types';
import Flag, {FlagGroup, AutoDismissFlag} from '@atlaskit/flag';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import {colors} from '@atlaskit/theme';
import {switchCase} from '../../../util/Common';
import {SUCCESS_ICON, WARNING_ICON, INFO_ICON, ERROR_ICON} from './constants';

const icons = {
    [INFO_ICON]: <Info label={`${INFO_ICON} icon`} primaryColor={colors.P300} />,
    [SUCCESS_ICON]: <Tick label={`${SUCCESS_ICON} icon`} primaryColor={colors.G300} />,
    [WARNING_ICON]: <Warning label={`${WARNING_ICON} icon`} primaryColor={colors.Y300} />,
    [ERROR_ICON]: <Error label={`${ERROR_ICON} icon`} primaryColor={colors.R300} />,
};

const NexusToastNotification = ({toasts, removeToast}) => (
    <FlagGroup onDismissed={removeToast}>
        {toasts.map((toast, index) => {
            const updatedToast = {
                ...toast,
                ...(toast.icon &&
                    !isValidElement(toast.icon) && {icon: switchCase(icons)(icons[INFO_ICON])(toast.icon)}),
            };
            return toast.isAutoDismiss ? (
                <AutoDismissFlag key={index} {...updatedToast} />
            ) : (
                <Flag key={index} {...updatedToast} />
            );
        })}
    </FlagGroup>
);

NexusToastNotification.propTypes = {
    toasts: PropTypes.array,
    removeToast: PropTypes.func,
};

NexusToastNotification.defaultProps = {
    toasts: [],
    removeToast: () => null,
};

export default React.memo(NexusToastNotification);
