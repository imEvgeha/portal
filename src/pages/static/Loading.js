import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';
import './Loading.scss';

const Loading = ({spinnerSize}) => (
    <div className="nexus-c-loading">
        <Spinner size={spinnerSize} />
    </div>
);

Loading.propTypes = {
    spinnerSize: PropTypes.string,
};

Loading.defaultProps = {
    spinnerSize: 'large',
};

export default Loading;
