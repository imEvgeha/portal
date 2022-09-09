import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from '@portal/portal-components';
import {cloneDeep} from 'lodash';
import {MultiSelect} from 'primereact/multiselect';
import {compose} from 'redux';
import {LOCALIZED_VALUE_NOT_DEFINED} from '../nexus-dynamic-form/constants';
import withOptionalCheckbox from '../nexus-dynamic-form/hoc/withOptionalCheckbox';
import {formatOptions} from '../nexus-dynamic-form/utils';
import './NexusSelect.scss';

const DropdownWithOptional = compose(withOptionalCheckbox())(Dropdown);
const MultiselectWithOptional = compose(withOptionalCheckbox())(MultiSelect);

const NexusSelect = ({
    defaultValue,
    fieldProps,
    type,
    id,
    optionsConfig,
    selectValues,
    path,
    isRequired,
    isMultiselect,
    language,
    addedProps,
    optionsFilterParameter,
    showLocalized,
    isCreateMode,
}) => {
    const fieldValues = fieldProps?.value;
    const [fetchedOptions, setFetchedOptions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(
        Array.isArray(defaultValue)
            ? defaultValue.map(o => (o.value?.value ? o.value.value : o.value))
            : defaultValue?.value
    );

    useEffect(() => {
        if (optionsConfig.options === undefined) {
            if (Object.keys(selectValues).length) {
                let options = cloneDeep(selectValues[path]);
                options = formatOptions(options, optionsConfig);
                addDeselectOption(options);
                setFetchedOptions(options.sort(selectCompare));
            }
        }
    }, [selectValues]);

    // function to compare localized values in English
    const selectCompare = (a, b) => {
        // extract english text in brackets
        return a.label.split('(')[1] > b.label.split('(')[1]
            ? 1
            : b.label.split('(')[1] > a.label.split('(')[1]
            ? -1
            : 0;
    };

    const addDeselectOption = options => {
        if (type === 'select' && !isRequired) {
            const deselectOption = {label: 'Select...', value: null};
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

    const formatOptionLabel = option => {
        const notLocalized = !!(option?.label?.includes('(') && option?.label?.includes(')*'));
        const genresArray = selectValues.genres;
        let singleGenre;
        let localisedGenreName;
        let localisedCheck = false;
        const foundOption = genresArray.find(o => o.name === option.label.substring(1, option.label.length - 2));
        if (foundOption) {
            singleGenre = foundOption;
            const foundLocalization = singleGenre.localizations.find(
                o => o.language === language && o.language !== 'en'
            );
            foundLocalization
                ? ((localisedGenreName = `${foundLocalization.name} (${singleGenre.name})`), (localisedCheck = true))
                : ((localisedGenreName = language === 'en' ? singleGenre.name : `(${singleGenre.name})*`),
                  (localisedCheck = false));
        }
        return (
            <div className={`${localisedCheck || language === 'en' || !notLocalized ? 'bold' : 'italic'}`}>
                <span title={!localisedCheck && language !== 'en' ? LOCALIZED_VALUE_NOT_DEFINED : null}>
                    {localisedGenreName || option.label}
                </span>
            </div>
        );
    };

    if (path === 'metadataStatus') {
        const selectLabel = fieldValues?.label;
        if (selectLabel) {
            const upperLabel = selectLabel[0].toUpperCase() + selectLabel.substr(1);
            fieldValues.label = upperLabel;
        }
    }

    const options = optionsConfig.options !== undefined ? optionsConfig.options.sort(selectCompare) : filterOptions();

    if (path === 'advisoriesCode' && fieldValues) {
        fieldValues.forEach(fieldValue => {
            const labelFromOptions = options?.find(option => option.value === fieldValue?.value)?.label;
            if (labelFromOptions && fieldValue?.label) fieldValue.label = labelFromOptions;
        });
    }

    return (
        <div className="nexus-select">
            {isMultiselect ? (
                options?.length ? (
                    <MultiselectWithOptional
                        {...fieldProps}
                        id={id}
                        value={selectedItem}
                        options={options}
                        columnClass="col-12"
                        placeholder="Select"
                        display="chip"
                        optionValue="value"
                        filterBy="label,value"
                        filter={options.length >= 10}
                        appendTo="self"
                        onChange={e => {
                            const values = options.filter(l => e.value.includes(l.value));
                            fieldProps?.onChange?.(values);
                            setSelectedItem(e.value);
                        }}
                    />
                ) : null
            ) : (
                <DropdownWithOptional
                    {...fieldProps}
                    {...addedProps}
                    className="nexus-c-nexus-select-container"
                    id={id}
                    options={options}
                    value={selectedItem}
                    appendTo="self"
                    columnClass="col-12"
                    placeholder="Select"
                    optionValue="value"
                    filterBy="label,value"
                    filter={options.length >= 10}
                    onChange={e => {
                        const value = options.find(x => x.value === e.value);
                        fieldProps?.onChange?.(value);
                        setSelectedItem(e.value);
                    }}
                />
            )}
        </div>
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
    showLocalized: PropTypes.bool,
    language: PropTypes.string,
    id: PropTypes.string,
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
    showLocalized: false,
    language: 'en',
    id: '',
};

export default NexusSelect;
