import React from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';
import FieldRequired from '../field-required/FieldRequired';

const FieldLabel = ({htmlFor, label, isRequired}) => {
    return label ? (
        <label htmlFor={htmlFor}>
            {capitalize(label)}
            <FieldRequired required={!!isRequired} />
        </label>
    ) : null;
};

FieldLabel.propTypes = {
    htmlFor: PropTypes.string,
    label: PropTypes.string,
    isRequired: PropTypes.bool,
};

FieldLabel.defaultProps = {
    htmlFor: undefined,
    label: undefined,
    isRequired: false,
};

export default FieldLabel;
