import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import Button from '@atlaskit/button';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import {isEmpty} from 'lodash';
import './CustomIconFilter.scss';
/* eslint-disable react/prop-types */

export default forwardRef((props, ref) => {
    const [value, setValue] = useState(props.initialFilters);

    useEffect(() => {
        props.filterChangedCallback();
    }, [value]);

    const onChange = v => {
        // if (!v) {
        //     return;
        // }
        // Filter doesn't persist when switching ingest without this check
        setValue(v);
    };

    // expose AG Grid Filter Lifecycle callbacks
    useImperativeHandle(ref, () => {
        return {
            doesFilterPass() {
                return true;
            },

            isFilterActive() {
                return value && !isEmpty(value);
            },

            getModel() {
                return {
                    type: 'equals',
                    filter: {updatedCatalogReceived: true},
                };
            },

            setModel(val) {
                onChange(val);
            },
        };
    });

    return (
        <div className="nexus-c-custom-complex-filter">
            <Button onClick={onChange}>
                <WarningIcon primaryColor="#a5adba" width="30px" />
            </Button>
        </div>
    );
});
