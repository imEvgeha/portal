import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Toast} from 'primereact/toast';
import {connect} from 'react-redux';
import { createToastSelector } from './NexusToastNotificationSelectors';

const NexusToastNotification = ({toast}) => {
    const toastRef = useRef(null);

    useEffect(() => {
        if(toastRef.current && toast) {
            toastRef.current.show(toast);
        } if (toast === null) {
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

const mapStateToProps = () => {
    const toastSelector = createToastSelector();

    return (state, props) => ({
        toast: toastSelector(state, props),
    });
};

export default connect(mapStateToProps)(NexusToastNotification);