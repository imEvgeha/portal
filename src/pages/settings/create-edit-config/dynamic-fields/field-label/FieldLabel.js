import React from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';
import FieldRequired from '../field-required/FieldRequired';

const FieldLabel = ({htmlFor, label, additionalLabel, isRequired}) => {
    return label ? (
        <label htmlFor={htmlFor}>
            {capitalize(label)}
            {additionalLabel}
            <FieldRequired required={!!isRequired} />
        </label>
    ) : null;
};

FieldLabel.propTypes = {
    htmlFor: PropTypes.string,
    label: PropTypes.string,
    additionalLabel: PropTypes.string,
    isRequired: PropTypes.bool,
};

FieldLabel.defaultProps = {
    htmlFor: undefined,
    label: undefined,
    additionalLabel: '',
    isRequired: false,
};

export default FieldLabel;
