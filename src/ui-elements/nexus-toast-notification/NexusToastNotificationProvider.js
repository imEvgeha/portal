import React from 'react';
import {connect} from 'react-redux';
import NexusToastNotificationContext from './NexusToastNotificationContext';
import NexusToastNotification from './NexusToastNotification';
import {getToasts} from './selectors';
import {addToast, removeToast} from './actions';

const NexusToastNotificationProvider = ({children, toasts, addToast, removeToast}) => { // eslint-disable-line

    const context = {
        addToast,
        removeToast,
        toasts,
    };

    return (
        <NexusToastNotificationContext.Provider value={context}>
            <NexusToastNotification toasts={toasts} />
            {children}
        </NexusToastNotificationContext.Provider>
    );
};

const mapStateToProps = state => ({
    toasts: getToasts(state),
});

const mapDispatchToProps = (dispatch) => ({
    addToast: payload => dispatch(addToast(payload)),
    removeToast: payload => dispatch(removeToast(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NexusToastNotificationProvider);

