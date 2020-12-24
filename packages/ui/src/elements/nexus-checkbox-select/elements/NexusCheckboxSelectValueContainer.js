import React from 'react';
import PropTypes from 'prop-types';
import {components} from 'react-select';

const NexusCheckboxSelectValueContainer = ({children, ...props}) => {
    const {getValue, data} = props || {};
    const currentValues = getValue();
    let toBeRendered = children;
    if (currentValues.some(val => val.value === '*')) {
        toBeRendered = children.filter(({props}) => {
            return props && data && data.value !== '*';
        });
    }

    return <components.ValueContainer {...props}>{toBeRendered}</components.ValueContainer>;
};

NexusCheckboxSelectValueContainer.propTypes = {
    getValue: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};

export default NexusCheckboxSelectValueContainer;
