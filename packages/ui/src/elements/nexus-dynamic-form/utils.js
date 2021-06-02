import React from 'react';
import {ErrorMessage} from '@atlaskit/form';
import {equalOrIncluded, getSortedData} from '@vubiquity-nexus/portal-utils/lib/Common';
import classnames from 'classnames';
import {get, isObjectLike} from 'lodash';
import NexusArray from './components/NexusArray';
import NexusArrayWithTabs from './components/NexusArrayWithTabs';
import NexusField from './components/NexusField/NexusField';
import {areAllWithdrawn} from './valdationUtils/areAllWithdrawn';
import {fieldRequired} from './valdationUtils/fieldRequired';
import {incorrectValue} from './valdationUtils/incorrectValue';
import {isDuration} from './valdationUtils/isDuration';
import {isInteger} from './valdationUtils/isInteger';
import {isTime} from './valdationUtils/isTime';
import {isYear} from './valdationUtils/isYear';
import {lengthEqual} from './valdationUtils/lengthEqual';
import {VIEWS, FIELD_REQUIRED, NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS} from './constants';

export const getFieldConfig = (field, config, view) => {
    const viewConfig =
        field &&
        field.viewConfig &&
        field.viewConfig.find(c => view === c.view && (get(c, config) || get(c, config) === false));
    return viewConfig && viewConfig[config];
};

export const getDefaultValue = (field = {}, view, data) => {
    if (field.type === 'dateRange') {
        return {
            startDate: get(data, field.path[0]),
            endDate: get(data, field.path[1]),
        };
    }
    const value = get(data, field.path) !== null ? get(data, field.path) : '';

    if ((view === VIEWS.CREATE || get(field, 'isOptional')) && !value) {
        return getFieldConfig(field, 'defaultValue', view);
    }
    return value;
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

const checkArrayFieldDependencies = (formData, {field, value, subfield}) => {
    let retValue = false;
    formData[field].map(obj => {
        if (obj[subfield] === value) {
            retValue = obj[subfield];
        }
        return null;
    });
    return retValue;
};

const checkGlobalDependencies = (dependencies, formData) => {
    return !!(
        dependencies &&
        dependencies.some(({field, value, subfield}) => {
            let dependencyValue = get(formData, field);
            if (Array.isArray(dependencyValue)) {
                dependencyValue = checkArrayFieldDependencies(formData, {field, value, subfield});
            }
            // if has value || its value equal to the provided value
            return dependencyValue === value || (!!dependencyValue && value === 'any');
        })
    );
};
const evaluateDependency = (dep, formData) => {
    // checks 'OR' condition between every entry in sub array (fields)
    return dep.fields.some(({name, value, subfield}, index) => {
        let dependencyValue = get(formData, name);
        if (Array.isArray(dependencyValue)) {
            const field = name;
            dependencyValue = checkArrayFieldDependencies(formData, {field, value, subfield});
        }
        // check for operator: value (ne, gt, lt etc)
        if (dep.fields[index].hasOwnProperty('operator')) {
            if (dep.fields[index]['operator'] === 'ne') return dependencyValue !== value;
            else if (dep.fields[index]['operator'] === 'lt') return dependencyValue < value;
            else if (dep.fields[index]['operator'] === 'gt') return dependencyValue > value;
        }
        // if has value || its value equal to the provided value
        return dependencyValue === value || (!!dependencyValue && value === 'any');
    });
};
const checkLocalDependencies = (dependencies, formData) => {
    // checks 'AND' condition between every entry in dependencies array
    return !!(dependencies.length && dependencies.every(dep => evaluateDependency(dep, formData)));
};

const checkDependencyValues = (dependencies, getCurrentValues) => {
    let allValues = [];
    dependencies.length &&
        dependencies.forEach(dep => {
            const fields = get(dep, 'fields', []);
            const values = [];
            fields.forEach(({name}) => {
                const formData = getCurrentValues();
                let value = get(formData, name);
                if (isObjectLike(value) && get(value, 'value')) {
                    value = get(value, 'value');
                }
                values.push({value, name});
            });
            allValues = allValues.concat(values);
        });
    return allValues;
};

// eslint-disable-next-line max-params
export const checkFieldDependencies = (type, view, dependencies, {formData, config, isEditable, getCurrentValues}) => {
    // View mode has the same dependencies as Edit mode
    const currentView = view === VIEWS.CREATE ? VIEWS.CREATE : VIEWS.EDIT;
    const globalConfig = config && config.filter(d => d.type === type && d.view === currentView);
    const foundDependencies = dependencies && dependencies.filter(d => d.type === type && d.view === currentView);

    if (type === 'values') return checkDependencyValues(foundDependencies, getCurrentValues);

    const globalConfigResult = checkGlobalDependencies(globalConfig, formData);

    const localConfigResult = checkLocalDependencies(foundDependencies, formData);

    return isEditable ? localConfigResult : globalConfigResult || localConfigResult;
};

const isEmptyMultiselect = (value, isRequired) => {
    if (isRequired && (value === null || (value && value.length === 0))) return FIELD_REQUIRED;
};

export const getValidationFunction = (value, validations, {type, isRequired, getCurrentValues}) => {
    if (type === 'multiselect') return isEmptyMultiselect(value, isRequired);
    const isRequiredFunction = {
        name: 'fieldRequired',
    };
    const updatedValidations = isRequired ? [...validations, isRequiredFunction] : validations;
    // load dynamic file
    if (updatedValidations && updatedValidations.length > 0) {
        const promises = updatedValidations.map(v => {
            switch (v.name) {
                case 'fieldRequired':
                    return fieldRequired(value, v.args, getCurrentValues);
                    break;
                case 'areAllWithdrawn':
                    return areAllWithdrawn(value, v.args, getCurrentValues);
                    break;
                case 'incorrectValue':
                    return incorrectValue(value, v.args, getCurrentValues);
                    break;
                case 'isDuration':
                    return isDuration(value, v.args, getCurrentValues);
                    break;
                case 'isInteger':
                    return isInteger(value, v.args, getCurrentValues);
                    break;
                case 'isTime':
                    return isTime(value, v.args, getCurrentValues);
                    break;
                case 'isYear':
                    return isYear(value, v.args, getCurrentValues);
                    break;
                case 'lengthEqual':
                    return lengthEqual(value, v.args, getCurrentValues);
                    break;
            }
        });
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

export const sortOptions = options => {
    const SORT_TYPE = 'label';
    return getSortedData(options, SORT_TYPE, true);
};

export const getAllFields = (schema, onlyInnerFields) => {
    let sectionsFields = {};
    const fields = schema.map(s => s.sections.map(e => e.fields)).flat();
    fields.forEach(section => {
        sectionsFields = {...sectionsFields, ...section};
    });
    let innerFields = {};
    Object.keys(sectionsFields).forEach(key => {
        const arrayFields = get(sectionsFields[key], 'fields');
        innerFields = {...innerFields, ...arrayFields};
    });
    return onlyInnerFields ? innerFields : {...sectionsFields, ...innerFields};
};

export const getFieldValue = fieldProps => {
    if (fieldProps && Array.isArray(fieldProps)) {
        const newValues = [];
        fieldProps.forEach(obj => {
            if (get(obj, 'value') && get(obj, 'label')) {
                newValues.push(get(obj, 'value'));
            } else {
                newValues.push(obj);
            }
        });
        return newValues;
    }
    return fieldProps && fieldProps.value !== undefined ? fieldProps.value : fieldProps;
};

export const getProperValue = (type, value, path, schema) => {
    let val = '';
    if (value === null) val = [];
    switch (type) {
        case 'number':
            val = Number(value);
            break;
        case 'dateRange':
            val = {
                [path[0]]: value.startDate,
                [path[1]]: value.endDate,
            };
            break;
        case 'stringInArray':
            if (!value) {
                val = [];
            } else {
                val = Array.isArray(value) ? value : value.split(',').map(strValue => strValue.trim());
            }
            break;
        case 'array':
            val = value ? value.map(v => getProperValues(schema, v)) : [];
            break;
        case 'select':
        case 'multiselect':
            val = getFieldValue(value);
            break;
        default:
            val = value;
    }
    if (value === '') val = null;
    return Array.isArray(path) ? val : {[path]: val};
};

const toShow = (field, initialData) => {
    const showWhen = get(field, 'showWhen', []);
    if (showWhen.length) {
        let retValue = false;
        field.showWhen.forEach(conditionObj => {
            // OR condition
            if (Array.isArray(conditionObj)) {
                // AND condition
                let areAllTrue = true;
                conditionObj.forEach(obj => {
                    const value = get(initialData, obj.field, '');
                    if (obj.hasValue === 'any') {
                        areAllTrue = !value ? false : areAllTrue;
                    } else if (value !== obj.hasValue) {
                        areAllTrue = false;
                    }
                });
                retValue = areAllTrue ? true : retValue;
            } else {
                const value = get(initialData, conditionObj.field, '');
                if (value === conditionObj.hasValue) retValue = true;
            }
        });
        return retValue;
    }
    return true;
};

export const buildSection = (
    fields = {},
    getValues,
    view,
    generateMsvIds,
    regenerateAutoDecoratedMetadata,
    setRefresh,
    {
        selectValues,
        initialData,
        setFieldValue,
        update,
        config,
        isGridLayout,
        searchPerson,
        castCrewConfig,
        tabs,
        subTabs,
        setDisableSubmit,
    }
) => {
    return (
        <div className={isGridLayout ? 'nexus-c-dynamic-form__section--grid' : ''}>
            {Object.keys(fields).map(key => {
                return (
                    !getFieldConfig(fields[key], 'hidden', view) &&
                    toShow(fields[key], initialData) &&
                    (get(fields[key], 'type') === 'array' ? (
                        <NexusArray
                            key={key}
                            view={view}
                            selectValues={selectValues}
                            data={getDefaultValue(fields[key], view, initialData)}
                            getValues={getValues}
                            setFieldValue={setFieldValue}
                            validationError={getValidationError(initialData.validationErrors, fields[key])}
                            isUpdate={update}
                            config={config}
                            generateMsvIds={generateMsvIds}
                            {...fields[key]}
                        />
                    ) : get(fields[key], 'type') === 'arrayWithTabs' ? (
                        <NexusArrayWithTabs
                            key={key}
                            view={view}
                            selectValues={selectValues}
                            data={getDefaultValue(fields[key], view, initialData)}
                            getValues={getValues}
                            setFieldValue={setFieldValue}
                            isUpdate={update}
                            config={config}
                            tabs={tabs}
                            subTabs={subTabs}
                            generateMsvIds={generateMsvIds}
                            regenerateAutoDecoratedMetadata={regenerateAutoDecoratedMetadata}
                            searchPerson={searchPerson}
                            castCrewConfig={castCrewConfig}
                            {...fields[key]}
                            setRefresh={setRefresh}
                        />
                    ) : (
                        <div key={key} className="nexus-c-dynamic-form__field">
                            {renderNexusField(key, view, getValues, generateMsvIds, {
                                initialData,
                                field: fields[key],
                                selectValues,
                                setFieldValue,
                                config,
                                isGridLayout,
                                searchPerson,
                                castCrewConfig,
                                setDisableSubmit,
                            })}
                        </div>
                    ))
                );
            })}
        </div>
    );
};

export const renderNexusField = (
    key,
    view,
    getValues,
    generateMsvIds,
    {
        initialData = {},
        field,
        selectValues,
        setFieldValue,
        config,
        isGridLayout,
        searchPerson,
        castCrewConfig,
        inTabs,
        path,
        setDisableSubmit,
    }
) => {
    return (
        <NexusField
            {...field}
            id={key}
            key={key}
            name={key}
            label={field.name}
            view={view}
            formData={inTabs ? {[NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS[path]]: initialData} : getValues()}
            validationError={getValidationError(initialData.validationErrors, field)}
            defaultValue={getDefaultValue(field, view, initialData)}
            selectValues={selectValues}
            setFieldValue={setFieldValue}
            getCurrentValues={getValues}
            config={config}
            isGridLayout={isGridLayout}
            searchPerson={searchPerson}
            castCrewConfig={castCrewConfig}
            generateMsvIds={generateMsvIds}
            setDisableSubmit={setDisableSubmit}
            initialData={initialData}
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

export const renderLabel = (label, isRequired, tooltip, isGridLayout) => {
    return (
        <div
            className={classnames('nexus-c-field__label', {
                'nexus-c-field__label--grid': isGridLayout,
            })}
        >
            {`${label}${isRequired ? '*' : ''}: `}
            {tooltip && (
                <span title={tooltip} style={{color: 'grey'}}>
                    <i className="far fa-question-circle" />
                </span>
            )}
        </div>
    );
};

export const renderError = (fieldProps, error) => {
    return (
        <div className="nexus-c-field__error">
            <ErrorMessage>{error}</ErrorMessage>
        </div>
    );
};

export const createUrl = (linkConfig, initialData) => {
    const {baseUrl, contentType} = linkConfig;
    const parentIds = get(initialData, 'parentIds', []);
    const id = parentIds.filter(parent => parent.contentType === contentType);
    if (id.length) {
        return baseUrl + id[0].id;
    }
    return '';
};
