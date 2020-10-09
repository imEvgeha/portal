import React from 'react';
import {ErrorMessage} from '@atlaskit/form';
import {get} from 'lodash';
import {equalOrIncluded, getSortedData} from '../../../util/Common';
import NexusArray from './components/NexusArray';
import NexusField from './components/NexusField/NexusField';
import {VIEWS} from './constants';

export const getFieldConfig = (field, config, view) => {
    const viewConfig = field && field.viewConfig && field.viewConfig.find(c => view === c.view && get(c, config));
    return viewConfig && viewConfig[config];
};

const getFieldPath = path => {
    const dotIndex = path.indexOf('.');
    return dotIndex > 0 ? path.substring(dotIndex + 1) : path;
};

export const getDefaultValue = (field = {}, view, data) => {
    if (view === VIEWS.CREATE) {
        return getFieldConfig(field, 'defaultValue', view);
    }
    if (field.type === 'dateRange') {
        return {
            startDate: get(data, field.path[0]),
            endDate: get(data, field.path[1]),
        };
    }
    return get(data, field.path) !== null ? get(data, getFieldPath(field.path)) : '';
};

export const getValidationError = (validationErrors, field) => {
    let error = null;
    const fieldValidationError =
        validationErrors && validationErrors.find(e => equalOrIncluded(field.path, e.fieldName));
    if (fieldValidationError) {
        error = fieldValidationError.message;
        if (fieldValidationError.sourceDetails) {
            if (fieldValidationError.sourceDetails.originalValue)
                error = `${error}, original value: ${fieldValidationError.sourceDetails.originalValue}`;
            if (fieldValidationError.sourceDetails.fileName) {
                error = `${error}, in file ${fieldValidationError.sourceDetails.fileName}, row number ${fieldValidationError.sourceDetails.rowId}, column ${fieldValidationError.sourceDetails.originalFieldName}`;
            }
        }
    }
    return error;
};

export const checkFieldDependencies = (type, view, dependencies, formData) => {
    // View mode has the same dependencies as Edit mode
    const currentView = view === VIEWS.CREATE ? VIEWS.CREATE : VIEWS.EDIT;
    const foundDependencies = dependencies && dependencies.filter(d => d.type === type && d.view === currentView);

    return !!(
        foundDependencies &&
        foundDependencies.some(({field, value}) => {
            const dependencyValue = get(formData, field);
            // if has value || its value equal to the provided value
            return dependencyValue === value || (!!dependencyValue && value === 'any');
        })
    );
};

const isEmptyMultiselect = (value, isRequired) => {
    if (isRequired && value === null) return 'THIS FIELD IS REQUIRED';
};

export const getValidationFunction = (value, validations, {type, isRequired}) => {
    if (type === 'multiselect') return isEmptyMultiselect(value, isRequired);
    const isRequiredFunction = {
        name: 'fieldRequired',
    };
    validations = isRequired ? [...validations, isRequiredFunction] : validations;
    // load dynamic file
    if (validations && validations.length > 0) {
        const promises = validations.map(v =>
            import(`./valdationUtils/${v.name}.js`).then(f => {
                return f[`${v.name}`](value, v.args);
            })
        );
        return Promise.all(promises).then(responses => {
            return responses.find(e => e !== undefined);
        });
    }
    return undefined;
};

export const formatOptions = (options, optionsConfig) => {
    const {defaultValuePath, defaultLabelPath} = optionsConfig;
    const valueField = defaultValuePath !== undefined ? defaultValuePath : 'value';
    const labelField = defaultLabelPath !== undefined ? defaultLabelPath : 'value';

    const formattedOptions = options.map(opt => {
        return {
            label: opt[labelField],
            value: opt[valueField],
        };
    });
    return sortOptions(formattedOptions);
};

const sortOptions = options => {
    const SORT_TYPE = 'label';
    return getSortedData(options, SORT_TYPE, true);
};

export const formatValues = values => {
    Object.keys(values).map(key => {
        if (values[key] === null) values[key] = [];
        if (typeof values[key] === 'object') {
            if (Array.isArray(values[key])) {
                values[key] = values[key].map(val => {
                    if (typeof val !== 'string') {
                        return val.value;
                    }
                    return val;
                });
            } else if (values[key].value) {
                values[key] = values[key].value;
            }
        }
    });
};

export const getAllFields = schema => {
    let sectionsFields = {};
    const fields = schema.map(s => s.sections.map(e => e.fields)).flat();
    fields.forEach(section => {
        sectionsFields = {...sectionsFields, ...section};
    });
    let allFields = sectionsFields;
    Object.keys(sectionsFields).forEach(key => {
        const arrayFields = get(sectionsFields[key], 'fields');
        allFields = {...allFields, ...arrayFields};
    });
    return allFields;
};

export const getProperValue = (type, value, path, schema) => {
    let val = '';
    switch (type) {
        case 'number':
            val = Number(value);
        case 'dateRange':
            val = {
                [path[0]]: value.startDate,
                [path[1]]: value.endDate,
            };
            break;
        case 'stringInArray':
            val = Array.isArray(value) ? value : [value];
            break;
        case 'array':
            val = value ? value.map(v => getProperValues(schema, v)) : [];
            break;
        case 'multiselect':
        case 'select':
            val = value;
            if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    val = value.map(val => {
                        if (typeof val !== 'string') {
                            return val.value;
                        }
                        return val;
                    });
                } else if (value.value) {
                    val = value.value;
                }
            }
            break;
        default:
            val = value;
    }
    return Array.isArray(path) ? val : {[path]: val};
};

export const buildSection = (
    fields = {},
    getValues,
    view,
    initialData,
    setFieldValue,
    schema,
    setDisableSubmit,
    selectValues
) => {
    return (
        <>
            {Object.keys(fields).map(key => {
                return (
                    !getFieldConfig(fields[key], 'hidden', view) &&
                    (get(fields[key], 'type') === 'array' ? (
                        <NexusArray
                            key={key}
                            view={view}
                            data={getDefaultValue(fields[key], view, initialData)}
                            getValues={getValues}
                            setFieldValue={setFieldValue}
                            setDisableSubmit={setDisableSubmit}
                            validationError={getValidationError(initialData.validationErrors, fields[key])}
                            {...fields[key]}
                        />
                    ) : (
                        <div key={key} className="nexus-c-dynamic-form__field">
                            {renderNexusField(key, view, getValues, initialData, fields[key], selectValues)}
                        </div>
                    ))
                );
            })}
        </>
    );
};

export const renderNexusField = (key, view, getValues, initialData, field, selectValues) => {
    return (
        <NexusField
            {...field}
            id={key}
            key={key}
            name={key}
            label={field.name}
            view={view}
            formData={getValues()}
            validationError={getValidationError(initialData.validationErrors, field)}
            defaultValue={getDefaultValue(field, view, initialData)}
            selectValues={selectValues}
        />
    );
};

export const getProperValues = (schema, values) => {
    // handle values before submit
    let properValues = {};
    const allFields = getAllFields(schema);
    Object.keys(values).forEach(key => {
        const field = allFields[key];
        if (field) {
            const {path} = field;
            properValues = {
                ...properValues,
                ...getProperValue(field.type, values[key], path, schema),
            };
        } else {
            properValues = {
                ...properValues,
                ...{[key]: values[key]},
            };
        }
    });
    return properValues;
};

export const renderLabel = (label, isRequired, tooltip) => {
    return (
        <div className="nexus-c-field__label">
            {`${label}${isRequired ? '*' : ''}: `}
            {tooltip && (
                <span title={tooltip} style={{color: 'grey'}}>
                    <i className="far fa-question-circle" />
                </span>
            )}
        </div>
    );
};

export const renderError = error => {
    return <div className="nexus-c-field__error">{error && <ErrorMessage>{error}</ErrorMessage>}</div>;
};
