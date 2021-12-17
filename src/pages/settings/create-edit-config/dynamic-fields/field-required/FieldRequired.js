import React from 'react';
import PropTypes from 'prop-types';

const FieldRequired = ({required}) => {
    return required ? <span className="p-field-required">*</span> : null;
};
FieldRequired.propTypes = {
    required: PropTypes.bool,
};

FieldRequired.defaultProps = {
    required: false,
};

export default FieldRequired;
