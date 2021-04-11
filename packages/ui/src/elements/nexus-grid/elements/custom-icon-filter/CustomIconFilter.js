import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import Button from '@atlaskit/button';
import {getIcon} from '../value-formatter/createValueFormatter';
import './CustomIconFilter.scss';
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
        // Filter doesn't persist when switching ingest without this check
        setValue(!value);
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
                        filter: props.searchQuery,
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
            <Button onClick={onChange}>{getIcon(props.icon, value)}</Button>
        </div>
    );
});
