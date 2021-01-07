import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import {cloneDeep} from 'lodash';
import {compose} from 'redux';
import withOptionalCheckbox from '../nexus-dynamic-form/hoc/withOptionalCheckbox';
import {formatOptions} from '../nexus-dynamic-form/utils';
import './NexusSelect.scss';

const SelectWithOptional = compose(withOptionalCheckbox())(Select);

const NexusSelect = ({
    defaultValue,
    fieldProps,
    type,
    optionsConfig,
    selectValues,
    path,
    isRequired,
    isMultiselect,
    addedProps,
}) => {
    const [fetchedOptions, setFetchedOptions] = useState([]);

    useEffect(() => {
        if (optionsConfig.options === undefined) {
            if (Object.keys(selectValues).length) {
                let options = cloneDeep(selectValues[path]);
                options = formatOptions(options, optionsConfig);
                addDeselectOption(options);
                setFetchedOptions(options);
            }
        }
    }, [selectValues]);

    const addDeselectOption = options => {
        if (type === 'select' && !isRequired) {
            const deselectOption = {label: 'Select...', value: ''};
            options.unshift(deselectOption);
        }
    };

    return isMultiselect ? (
        <SelectWithOptional
            {...fieldProps}
            options={optionsConfig.options !== undefined ? optionsConfig.options : fetchedOptions}
            isMulti
            defaultValue={defaultValue}
            {...addedProps}
        />
    ) : (
        <SelectWithOptional
            {...fieldProps}
            options={optionsConfig.options !== undefined ? optionsConfig.options : fetchedOptions}
            defaultValue={defaultValue}
            {...addedProps}
            className="nexus-c-nexus-select-container"
            classNamePrefix="nexus-c-nexus-select"
        />
    );
};

NexusSelect.propTypes = {
    defaultValue: PropTypes.any,
    fieldProps: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    optionsConfig: PropTypes.object,
    selectValues: PropTypes.object,
    path: PropTypes.any,
    isRequired: PropTypes.bool,
    isMultiselect: PropTypes.bool,
    addedProps: PropTypes.object.isRequired,
};

NexusSelect.defaultProps = {
    defaultValue: undefined,
    optionsConfig: {},
    selectValues: {},
    path: null,
    isRequired: false,
    isMultiselect: false,
};

export default NexusSelect;