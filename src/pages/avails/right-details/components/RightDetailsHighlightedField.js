import React from 'react';
import PropTypes from 'prop-types';
import './RightDetailsHighlightedField.scss';

const RightDetailsHighlightedField = ({name, value}) => {
    return (
        <div className="nexus-c-right-details-highlighted-field">
            <p className="nexus-c-right-details-highlighted-field__title">{name}</p>
            <p>{value}</p>
        </div>
    );
};

RightDetailsHighlightedField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
};

RightDetailsHighlightedField.defaultProps = {
    name: null,
    value: null,
};

export default RightDetailsHighlightedField;
