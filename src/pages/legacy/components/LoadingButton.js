import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'react-fa';

export default class LoadingButton extends React.Component {
    render() {
        let {bsStyle, children, className, disabled, loading, ...props} = this.props;
        let classes = `btn btn-${bsStyle}`;
        if (className) {
            classes += ` ${className}`;
        }
        disabled = disabled || loading;
        return (
            <button className={classes} disabled={disabled} {...props}>
                {loading && <Icon name="spinner" spin />} {children}
            </button>
        );
    }
}

LoadingButton.propTypes = {
    loading: PropTypes.bool,
    bsStyle: PropTypes.string,
    type: PropTypes.string,
};

LoadingButton.defaultProps = {
    bsStyle: 'primary',
    type: 'button',
};
