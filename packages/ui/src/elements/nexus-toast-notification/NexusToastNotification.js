import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Toast} from 'primereact/toast';

const NexusToastNotification = ({toasts, removeToast}) => {
    const toast = useRef(null);
    const showToast = (toastParam) => {
        const {severity, summary, detail, life, sticky, content, closable} = toastParam;
        if(toast.current) {
            toast.current.show({
                severity,
                summary,
                detail,
                life,
                sticky,
                content,
                closable,
            });
        }
    }

    useEffect(() => {
        if(!toasts.length) {
            const lifeTime = toast.current?.state?.messages?.[0]?.life;
            setTimeout(() => toast.current.clear(), lifeTime || 0) 
        }
    }, [toasts])

    toasts.forEach((item, index) => {
        showToast(item);
        item.isAutoDismiss && removeToast(index);
    });
    
    return (<Toast ref={toast} position="bottom-left" className='p-toast' />)
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
