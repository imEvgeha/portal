import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Toast} from 'primereact/toast';
import withToasts from './hoc/withToasts';

const NexusToastNotification = ({toast}) => {
    const toastRef = useRef(null);

    const getUpdatedToast = () => {
        if (toast && toast.severity === 'error') {
            return {
                ...toast,
                sticky: true,
            }
        } else if (toast && toast.severity === 'success') {
            return {
                // ...toast,
                // life: 3000
                content: toast.content,
                severity: toast.severity,
                sticky: true,
            }
        }

        return toast;
    }
    // eslint-disable-next-line no-console
    console.log(getUpdatedToast(), 'getUpdatedToast()')

    useEffect(() => {
        if(toastRef.current && toast) {
            toastRef.current.show(getUpdatedToast());
        } else if (toastRef.current && !toast) {
            toastRef.current.clear();
        }
    }, [toast])

    return (<Toast ref={toastRef} position="bottom-left" className='p-toast' />)
};

NexusToastNotification.propTypes = {
    toast: PropTypes.any,
};

NexusToastNotification.defaultProps = {
    toast: null,
};

export default withToasts(NexusToastNotification);