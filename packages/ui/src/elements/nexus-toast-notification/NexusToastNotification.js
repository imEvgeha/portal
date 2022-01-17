import React, {isValidElement, useRef} from 'react';
import PropTypes from 'prop-types';
import Flag, {FlagGroup} from '@atlaskit/flag';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import {colors} from '@atlaskit/theme';
import {switchCase} from '@vubiquity-nexus/portal-utils/lib/Common';
import { Toast } from 'primereact/toast';
import {SUCCESS_ICON, WARNING_ICON, INFO_ICON, ERROR_ICON} from './constants';

const icons = {
    [INFO_ICON]: <Info label={`${INFO_ICON} icon`} primaryColor={colors.P300} />,
    [SUCCESS_ICON]: <Tick label={`${SUCCESS_ICON} icon`} primaryColor={colors.G300} />,
    [WARNING_ICON]: <Warning label={`${WARNING_ICON} icon`} primaryColor={colors.Y300} />,
    [ERROR_ICON]: <Error label={`${ERROR_ICON} icon`} primaryColor={colors.R300} />,
};

const UpdatedToast = ({toastParam}) => {
    console.log(toastParam, 'toastParam')
    const toast = useRef(null);
    const showSuccess = () => {
        if(toast.current) toast.current.show({severity: 'success', summary: 'Success Message', detail: 'Order submitted'});
    }

    showSuccess();
    return <Toast ref={toast} position="bottom-left" />;
}

UpdatedToast.propTypes = {
    toastParam: PropTypes.object,
};

UpdatedToast.defaultProps = {
    toastParam: {},
};



const NexusToastNotification = ({toasts, removeToast}) => {

    return (
        <FlagGroup onDismissed={removeToast}>
            {toasts.map((toast, index) => {
                {console.log(toasts, 'toasts')}
                // const updatedToast = {
                //     ...toast,
                //     ...(toast.icon &&
                //         !isValidElement(toast.icon) && {icon: switchCase(icons)(icons[INFO_ICON])(toast.icon)}),
                // };
                // if (toast.isAutoDismiss) {
                //     // setTimeout(() => removeToast(index), 3000);
                //     showSuccess();
                //     return <Toast key={index} ref={toast} life={3000} />;
                // }
                return <UpdatedToast toastParam={toast} key={index} />
            })}
        </FlagGroup>
    )
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
