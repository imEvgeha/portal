import React from 'react';
import PropTypes from 'prop-types';
import {toUpper} from 'lodash';
import FieldRequired from '../nexus-field-required/FieldRequired';

const FieldLabel = ({htmlFor, label, additionalLabel, isRequired}) => {
    return label ? (
        <div className="nexus-c-field-label">
            <label htmlFor={htmlFor}>
                {toUpper(label)}
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
};

FieldLabel.defaultProps = {
    htmlFor: undefined,
    label: undefined,
    additionalLabel: '',
    isRequired: false,
};

export default FieldLabel;
