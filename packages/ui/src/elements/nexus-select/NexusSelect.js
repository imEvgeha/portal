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
    optionsFilterParameter,
    isCreateMode,
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

    useEffect(() => {
        // todo: reset select value
        // isCreateMode && optionsFilterParameter.length && addedProps.setFieldValue && addedProps.setFieldValue(path, undefined);
    }, [optionsFilterParameter]);

    const addDeselectOption = options => {
        if (type === 'select' && !isRequired) {
            const deselectOption = {label: 'Select...', value: ''};
            options.unshift(deselectOption);
        }
    };

    const filterOptions = () => {
        if (optionsFilterParameter.length) {
            const options = cloneDeep(selectValues[path]);
            let filteredOptions = [];
            optionsFilterParameter.forEach(({name, value}) => {
                const [fieldName, propName] = name.split('.');
                const property = propName || fieldName;
                const filteredArray = options.filter(opt => opt[property] === value);
                filteredOptions = filteredOptions.concat(filteredArray);
            });
            return formatOptions(filteredOptions, optionsConfig);
        }
        return fetchedOptions;
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
            options={optionsConfig.options !== undefined ? optionsConfig.options : filterOptions()}
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
    optionsFilterParameter: PropTypes.array,
    isCreateMode: PropTypes.bool,
};

NexusSelect.defaultProps = {
    defaultValue: undefined,
    optionsConfig: {},
    selectValues: {},
    path: null,
    isRequired: false,
    isMultiselect: false,
    optionsFilterParameter: [],
    isCreateMode: false,
};

export default NexusSelect;
