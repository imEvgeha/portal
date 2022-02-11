import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Toast} from 'primereact/toast';
import withToasts from './hoc/withToasts';

const NexusToastNotification = ({toast}) => {
    const toastRef = useRef(null);

    useEffect(() => {
        if(toastRef.current && toast) {
            toastRef.current.show(toast);
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