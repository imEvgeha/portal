import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'primereact/toast';

const NexusToastNotification = ({toasts, removeToast}) => {
    const toast = useRef(null);
    const showToast = (toastParam) => {
        if(toast.current) toast.current.show({
            severity: toastParam.icon || toastParam.type || toastParam.severity,
            summary: toastParam.title || toastParam.summary,
            detail: toastParam.description || toastParam.detail,
            life: toasts.life,
            sticky: !toasts.life,
            content: toastParam.content,
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
