import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as selectors from '../NexusToastNotificatioSelectors';
import {addToast, removeToast} from '../NexusToastNotificationActions';

const withToasts = WrappedComponent => {
    const ComposedComponent = props => <WrappedComponent {...props} />;

    ComposedComponent.propTypes = {
        ...WrappedComponent.propTypes,
        toasts: PropTypes.array,
        addToast: PropTypes.func,
        removeToast: PropTypes.func,
    };

    ComposedComponent.defaultProps = {
        ...WrappedComponent.defaultProps,
        toasts: [],
        addToast: () => null,
        removeToast: () => null,
    };

    const mapStateToProps = state => ({
        toasts: selectors.getToasts(state),
    });

    const mapDispatchToProps = dispatch => ({
        addToast: payload => dispatch(addToast(payload)),
        removeToast: payload => dispatch(removeToast(payload)),
    });

    return connect(mapStateToProps, mapDispatchToProps)(ComposedComponent);
};

export default withToasts;
