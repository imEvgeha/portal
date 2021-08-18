import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import {cloneDeep} from 'lodash';
import {compose} from 'redux';
import {LOCALIZED_VALUE_NOT_DEFINED} from '../nexus-dynamic-form/constants';
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
    language,
    addedProps,
    optionsFilterParameter,
    showLocalized,
    isCreateMode,
}) => {
    const [fetchedOptions, setFetchedOptions] = useState([]);

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

    return isMultiselect ? (
        <SelectWithOptional
            {...fieldProps}
            options={optionsConfig.options !== undefined ? optionsConfig.options.sort(selectCompare) : filterOptions()}
            isMulti
            defaultValue={defaultValue}
            {...addedProps}
            formatOptionLabel={showLocalized ? formatOptionLabel : null}
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
    showLocalized: PropTypes.bool,
    language: PropTypes.string,
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
};

export default NexusSelect;
