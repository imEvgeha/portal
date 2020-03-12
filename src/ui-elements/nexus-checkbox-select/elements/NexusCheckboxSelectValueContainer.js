import React from 'react';
import {components} from 'react-select';

const NexusCheckboxSelectValueContainer = ({children, ...props}) => {
    const currentValues = props.getValue();
    let toBeRendered = children;
    if (currentValues.some(val => val.value === '*')) {
        toBeRendered = children.filter(({props}) => {
            return props && props.data && props.data.value !== '*';
        });
    }

    return (
        <components.ValueContainer {...props}>
            {toBeRendered}
        </components.ValueContainer>
    );
};

export default NexusCheckboxSelectValueContainer;
