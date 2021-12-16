import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {get, sortBy} from 'lodash';
import {Dropdown} from 'primereact/dropdown';
import {MultiSelect} from 'primereact/multiselect';
import {getConfigApiValues} from '../../../legacy/common/CommonConfigService';
import {cache} from '../../../legacy/containers/config/EndpointContainer';

const DynamicDropdown = ({elementSchema, formField}) => {
    const [value, setValue] = useState(undefined);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (elementSchema.name === 'licensees') {
            // licensees needs to be filtered by selected servicing region name
            // getLicensees(elementSchema, context);
        } else if (cache[elementSchema.source.url] === undefined) {
            const promise = getConfigApiValues(elementSchema.source.url, 0, 1000).then(response => {
                cache[elementSchema.source.url] = response.data;
                processOptions(response.data, elementSchema);
            });
            cache[elementSchema.source.url] = promise;
            // return promise;
        } else if (cache[elementSchema.source.url]) {
            if (cache[elementSchema.source.url] instanceof Promise) {
                // return cache[elementSchema.source.url].then(() => {});
                cache[elementSchema.source.url].then(() => {});
            }
            processOptions(cache[elementSchema.source.url], elementSchema);
        } else {
            console.error('Cannot load dropdown values from: ', elementSchema.source.url);
        }
    }, []);

    const processOptions = (rawOptions, field) => {
        const items = sortBy(
            rawOptions.map(rec => convertDataToOption(rec, field.source)),
            ['label']
        );
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
        let label; let value;
        const {displayValueDelimiter = ' / '} = schema;
        if (Array.isArray(schema.label) && schema.label.length > 1) {
            label = schema.label.map(fieldName => dataSource[fieldName]).join(displayValueDelimiter);
        } else {
            label = dataSource[schema.label || schema.value];
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
                        // onChange={e => setValue(e.value)}
                        filter={true}
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
                        placeholder={elementSchema.description}
                        disabled={elementSchema.disable}
                        // onChange={e => setValue(e.value)}
                        filter={true}
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
};

DynamicDropdown.defaultProps = {};

export default DynamicDropdown;
