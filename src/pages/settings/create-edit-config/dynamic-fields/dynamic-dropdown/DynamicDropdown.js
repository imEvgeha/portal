import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {get, sortBy, startCase} from 'lodash';
import {Dropdown} from 'primereact/dropdown';
import {MultiSelect} from 'primereact/multiselect';
import {getConfigApiValues} from '../../../../legacy/common/CommonConfigService';
import {cache} from '../../../../legacy/containers/config/EndpointContainer';

const DynamicDropdown = ({elementSchema, formField, change}) => {
    const [value, setValue] = useState(undefined);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        constructOptions();
    }, []);

    const constructOptions = () => {
        const sourceUrl = elementSchema?.source?.url;
        let cachedOption = cache[sourceUrl];
        if (elementSchema?.options) {
            const opts = elementSchema?.options?.[0]?.items?.map(i => ({value: i, label: startCase(i)}));
            setOptions(opts);
        } else if (elementSchema.name === 'licensees') {
            // licensees needs to be filtered by selected servicing region name
            // getLicensees(elementSchema, context);
        } else if (sourceUrl && cachedOption === undefined) {
            cachedOption = getConfigApiValues(sourceUrl, 0, 1000).then(response => {
                cachedOption = response.data;
                processOptions(response.data, elementSchema);
            });
        } else if (cachedOption) {
            if (cachedOption instanceof Promise) {
                cachedOption.then(res => {
                    processOptions(res, elementSchema);
                });
            } else {
                processOptions(cachedOption, elementSchema);
            }
        } else {
            console.error('Cannot load dropdown values from: ', sourceUrl);
        }
    };

    const processOptions = (rawOptions, field) => {
        const items = sortBy(rawOptions?.map(rec => convertDataToOption(rec, field.source)) || [], ['label']);
        console.log(items);
        setOptions(items);
        // return [{items}];
    };

    const getLicensees = (field, context) => {
        // needs to be moved to API side to make this generic
        const servicingRegion = get(context, 'value.servicingRegionName', '');

        if (!servicingRegion) {
            return;
        }
        if (get(cache[field.source.url], servicingRegion, '')) {
            // licensees cache is per servicing region
            if (cache[field.source.url][servicingRegion] instanceof Promise) {
                return cache[field.source.url][servicingRegion].then(() => {});
            }
            processOptions(cache[field.source.url][servicingRegion], field);
        }
        const promiseLicensees = getConfigApiValues(
            field.source.url,
            0,
            1000,
            '',
            'servicingRegion',
            servicingRegion
        ).then(response => {
            cache[field.source.url] = {
                ...cache[field.source.url],
                [servicingRegion]: response.data,
            };
            processOptions(response.data, field);
        });
        cache[field.source.url] = {
            ...cache[field.source.url],
            [servicingRegion]: promiseLicensees,
        };
        return promiseLicensees;
    };

    const convertDataToOption = (dataSource, schema) => {
        let label;
        let value;
        const {displayValueDelimiter = ' / '} = schema;
        if (Array.isArray(schema.label) && schema.label.length > 1) {
            label = schema.label.map(fieldName => dataSource[fieldName]).join(displayValueDelimiter);
        } else {
            label = dataSource[schema.label] || dataSource[schema.value];
        }
        if (Array.isArray(schema.value) && schema.value.length > 1) {
            value = schema.value.reduce(function (result, item) {
                result[item] = dataSource[item];
                return result;
            }, {});
        } else {
            value = dataSource[schema.value];
        }
        return {label, value};
    };

    const renderDdl = () => {
        switch (elementSchema.type) {
            case 'select': {
                return (
                    <Dropdown
                        {...formField}
                        id={elementSchema.id}
                        key={elementSchema.id}
                        // value={value}
                        placeholder={elementSchema.description}
                        disabled={elementSchema.disable}
                        options={options}
                        onChange={change}
                        filter={options.length > 10}
                        filterBy="label"
                    />
                );
            }
            case 'multiselect': {
                return (
                    <MultiSelect
                        {...formField}
                        id={elementSchema.id}
                        key={elementSchema.id}
                        // value={value}
                        options={options}
                        onChange={change}
                        placeholder={elementSchema.description}
                        disabled={elementSchema.disable}
                        filter={options.length > 10}
                        filterBy="label"
                    />
                );
            }
            default:
                break;
        }
    };

    return renderDdl();
};

DynamicDropdown.propTypes = {
    formField: PropTypes.object.isRequired,
    elementSchema: PropTypes.object.isRequired,
    change: PropTypes.func,
};

DynamicDropdown.defaultProps = {};

export default DynamicDropdown;
