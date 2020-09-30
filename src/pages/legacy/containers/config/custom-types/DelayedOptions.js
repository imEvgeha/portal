import {renderer as akRenderer} from 'react-forms-processor-atlaskit';
import PropTypes from 'prop-types';
import React from 'react';
import {get} from 'lodash';

const DelayedOptions = ({field, onChange, onFieldFocus, onFieldBlur}) => {
    const items = get(field, 'options[0].items', []);
    if (!items.includes(field.value)) {
        const val = items.find(option => JSON.stringify(option.value) === JSON.stringify(field.value));
        //find object with same values inside as field.value, replace reference in value with new one from options.
        //this is necessary because select uses '===' on.value of each options to determine the current one. works ok with primitives (because it checks values)
        //doesn't work with nonprimitives where operator '===' checks references, thats why we need this trick.
        if (val) {
            field.value = val.value;
        }
    }
    return (
        <div>
            {field.options && field.options.length > 0
                ? akRenderer(field, onChange, onFieldFocus, onFieldBlur)
                : 'Loading...'}
        </div>
    );
};

DelayedOptions.propTypes = {
    field: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onFieldFocus: PropTypes.func,
    onFieldBlur: PropTypes.func,
};

export default DelayedOptions;
