import React from 'react';
import {get} from 'lodash';
import {equalOrIncluded} from '../../../util/Common';
import NexusArray from './components/NexusArray';
import NexusField from './components/NexusField';
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
    return getFieldConfig(field, 'defaultValue', view)
        ? getFieldConfig(field, 'defaultValue', view)
        : get(data, getFieldPath(field.path)) !== null
        ? get(data, getFieldPath(field.path))
        : '';
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

export const getValidationFunction = (value, validations) => {
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

export const getFieldByName = (allFields, name) => {
    const k = Object.keys(allFields).find(key => !!key && allFields[key].name === name);
    return get(allFields, [k]);
};

export const getProperValue = (type, value, schema) => {
    switch (type) {
        case 'number':
            return Number(value);
        case 'stringInArray':
            return Array.isArray(value) ? value : [value];
        case 'array':
            const properValues = value.map(v => getProperValues(schema, v));
            return properValues;
        default:
            return value;
    }
};

export const buildSection = (fields = {}, getValues, view, initialData, setFieldValue, schema, setDisableSubmit) => {
    return (
        <>
            {Object.keys(fields).map(key => {
                return (
                    !getFieldConfig(fields[key], 'hidden', view) &&
                    (get(fields[key], 'type') === 'array' ? (
                        <NexusArray
                            key={key}
                            name={key}
                            view={view}
                            data={getDefaultValue(fields[key], view, initialData)}
                            fields={get(fields[key], 'fields')}
                            confirmationContent={get(fields[key], 'confirmationContent')}
                            getValues={getValues}
                            setFieldValue={setFieldValue}
                            setDisableSubmit={setDisableSubmit}
                        />
                    ) : (
                        <div key={key} className="nexus-c-dynamic-form__field">
                            {renderNexusField(key, view, getValues, initialData, fields[key])}
                        </div>
                    ))
                );
            })}
        </>
    );
};

export const renderNexusField = (key, view, getValues, initialData, field) => {
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
        />
    );
};

export const getProperValues = (schema, values) => {
    // handle values before submit
    const properValues = [];
    const allFields = getAllFields(schema);
    Object.keys(values).forEach(key => {
        const field = allFields[key];
        const {path} = field;
        properValues[path] = getProperValue(field.type, values[key], schema);
    });
    return {...properValues};
};
