import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import Button from '@atlaskit/button';
import {Form} from 'react-forms-processor';
import {renderer} from 'react-forms-processor-atlaskit';
import './CustomComplexFilter.scss';
/* eslint-disable react/prop-types */

export default forwardRef((props, ref) => {
    const [value, setValue] = useState(null);

    useEffect(() => {
        value !== null && props.filterChangedCallback();
    }, [value]);

    const onChange = v => {
        if (!v) {
            return;
        }
        setValue(v);
    };

    // expose AG Grid Filter Lifecycle callbacks
    useImperativeHandle(ref, () => {
        return {
            doesFilterPass() {
                return true;
            },

            isFilterActive() {
                return !!value;
            },

            getModel() {
                if (value) {
                    return {
                        type: 'equals',
                        filter: value?.filter || value,
                    };
                }
            },

            setModel(val) {
                onChange(val);
            },
        };
    });

    return (
        <div className="nexus-c-custom-complex-filter">
            <Form key={value} renderer={renderer} defaultFields={props.schema} onChange={onChange} />
            <Button className="nexus-c-custom-complex-filter--clear" onClick={() => onChange({})}>
                Clear
            </Button>
        </div>
    );
});
