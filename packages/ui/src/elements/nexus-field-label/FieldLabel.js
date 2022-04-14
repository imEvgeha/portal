import React from 'react';
import PropTypes from 'prop-types';
import {toUpper} from 'lodash';
import FieldRequired from '../nexus-field-required/FieldRequired';

const FieldLabel = ({htmlFor, label, additionalLabel, isRequired, shouldUpper, className}) => {
    return label ? (
        <div className={className}>
            <label htmlFor={htmlFor}>
                {shouldUpper ? toUpper(label) : label}
                {additionalLabel}
                <FieldRequired required={!!isRequired} />
            </label>
        </div>
    ) : null;
};

FieldLabel.propTypes = {
    htmlFor: PropTypes.string,
    label: PropTypes.string,
    additionalLabel: PropTypes.string,
    isRequired: PropTypes.bool,
    className: PropTypes.string,
    shouldUpper: PropTypes.bool,
};

FieldLabel.defaultProps = {
    htmlFor: undefined,
    label: undefined,
    additionalLabel: '',
    isRequired: false,
    className: 'nexus-c-field-label',
    shouldUpper: true,
};

export default FieldLabel;
