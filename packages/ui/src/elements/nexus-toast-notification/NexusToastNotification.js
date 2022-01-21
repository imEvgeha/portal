import React, {isValidElement, useRef} from 'react';
import PropTypes from 'prop-types';
import Flag, {FlagGroup} from '@atlaskit/flag';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import {colors} from '@atlaskit/theme';
import { Toast } from 'primereact/toast';
import {SUCCESS_ICON, WARNING_ICON, INFO_ICON, ERROR_ICON} from './constants';

const icons = {
    [INFO_ICON]: <Info label={`${INFO_ICON} icon`} primaryColor={colors.P300} />,
    [SUCCESS_ICON]: <Tick label={`${SUCCESS_ICON} icon`} primaryColor={colors.G300} />,
    [WARNING_ICON]: <Warning label={`${WARNING_ICON} icon`} primaryColor={colors.Y300} />,
    [ERROR_ICON]: <Error label={`${ERROR_ICON} icon`} primaryColor={colors.R300} />,
};


const NexusToastNotification = ({toasts, removeToast}) => {
    const toast = useRef(null);
    const showToast = (toastParam) => {
        if(toast.current) toast.current.show({
            severity: toastParam.icon || toastParam.type || toastParam.severity,
            summary: toastParam.title || toastParam.summary,
            detail: toastParam.description || toastParam.description,
            life: toasts.life || 3000
        });
    }

    toasts.map((toast, index) => {
        showToast(toast);
        removeToast(index);
    });
    
    return (<Toast ref={toast} position="bottom-left" />)
};

NexusToastNotification.propTypes = {
    toasts: PropTypes.array,
    removeToast: PropTypes.func,
};

NexusToastNotification.defaultProps = {
    toasts: [],
    removeToast: () => null,
};

export default React.memo(NexusToastNotification);
