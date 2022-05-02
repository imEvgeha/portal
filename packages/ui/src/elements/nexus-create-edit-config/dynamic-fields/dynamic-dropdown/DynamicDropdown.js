import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {get, sortBy, startCase} from 'lodash';
import {Dropdown} from 'primereact/dropdown';
import {MultiSelect} from 'primereact/multiselect';

const DynamicDropdown = ({elementSchema, formField, change, form, cache, dataApi}) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        constructOptions();
    }, []);

    useEffect(() => {
        const subscription = form.watch((value, {name}) => {
            if (elementSchema.id === 'licensees' && name?.includes('servicingRegionName')) {
                getDDValues(elementSchema, name);
            }
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    const constructOptions = () => {
        const sourceUrl = elementSchema?.source?.url;
        let cachedOption = cache[sourceUrl];

        if (elementSchema?.options) {
            const opts = elementSchema?.options?.[0]?.items?.map(i => ({value: i, label: startCase(i)}));
            setOptions(opts);
        } else if (elementSchema.id === 'licensees') {
            // licensees needs to be filtered by selected servicing region name
            getDDValues(elementSchema);
        } else if (sourceUrl && cachedOption === undefined && dataApi) {
            cachedOption = dataApi(sourceUrl).then(response => {
                cachedOption = response.data;
                cache[sourceUrl] = response.data;
                processOptions(response.data, elementSchema);
            });
            cache[sourceUrl] = cachedOption;
        } else if (cachedOption) {
            if (cachedOption instanceof Promise) {
                cachedOption.then(() => {
                    cachedOption = cache[sourceUrl];
                    processOptions(cachedOption, elementSchema);
                });
            } else {
                processOptions(cachedOption, elementSchema);
            }
        }
    };

    const processOptions = (rawOptions, field) => {
        const items = sortBy(rawOptions?.map(rec => convertDataToOption(rec, field.source)) || [], ['label']);
        setOptions(items);
    };

    const getDDValues = (field, valuePath) => {
        const value = (valuePath && form?.getValues(valuePath)) || '';

        if (get(cache[field.source.url], value, '')) {
            // licensees cache is per servicing region
            if (cache[field.source.url][value] instanceof Promise) {
                return cache[field.source.url][value].then(res => processOptions(res, field));
            }
            processOptions(cache[field.source.url][value], field);
        } else if (dataApi) {
            const apiResponse = dataApi(field.source.url, 'servicingRegion', value).then(response => {
                cache[field.source.url] = {
                    ...cache[field.source.url],
                    [value]: response.data,
                };
                processOptions(response.data, field);
            });
            cache[field.source.url] = {
                ...cache[field.source.url],
                [value]: apiResponse,
            };
        }
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
        if (schema.value && Array.isArray(schema.value) && schema.value.length > 1) {
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
                        placeholder={elementSchema.description}
                        disabled={elementSchema.disable}
                        options={options}
                        onChange={change}
                        tooltip={elementSchema.description}
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
                        options={options}
                        onChange={change}
                        placeholder={elementSchema.description}
                        disabled={elementSchema.disable}
                        tooltip={elementSchema.description}
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
    form: PropTypes.object.isRequired,
    cache: PropTypes.object,
    dataApi: PropTypes.func,
};

DynamicDropdown.defaultProps = {};

export default DynamicDropdown;
