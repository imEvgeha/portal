import React from 'react';
import {ErrorMessage} from '@atlaskit/form';
import {Restricted} from '@portal/portal-auth/permissions';
import {equalOrIncluded, getSortedData} from '@vubiquity-nexus/portal-utils/lib/Common';
import classnames from 'classnames';
import {get, isObject, isObjectLike} from 'lodash';
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
import {FIELD_REQUIRED, MANDATORY_VZ, NEXUS_ARRAY_WITH_TABS_FORM_MAPPINGS, ONE_MANDATORY_VZ, VIEWS} from './constants';

export const getFieldConfig = (field, config, view) => {
    const viewConfig =
        field &&
        field.viewConfig &&
        field.viewConfig.find(c => view === c.view && (get(c, config) || get(c, config) === false));
    return viewConfig && viewConfig[config];
};

export const checkIfEmetIsEditorial = (emet, editorial) => {
    return (
        emet.language === editorial.language &&
        emet.locale === editorial.locale &&
        emet?.format === editorial?.format &&
        emet?.service === editorial?.service
    );
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

    if (field.selectConfig) {
        return value?.map(x => x[field.selectConfig.defaultLabelPath]);
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
                error = `${error}, in file ${fieldValidationError.sourceDetails.fileName}, row number ${fieldValidationError.sourceDetails?.rowId}, column ${fieldValidationError.sourceDetails.originalFieldName}`;
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
                case 'areAllWithdrawn':
                    return areAllWithdrawn(value, v.args, getCurrentValues);
                case 'incorrectValue':
                    return incorrectValue(value, v.args, getCurrentValues);
                case 'isDuration':
                    return isDuration(value, v.args, getCurrentValues);
                case 'isInteger':
                    return isInteger(value, v.args, getCurrentValues);
                case 'isTime':
                    return isTime(value, v.args, getCurrentValues);
                case 'isYear':
                    return isYear(value, v.args, getCurrentValues);
                case 'lengthEqual':
                    return lengthEqual(value, v.args, getCurrentValues);
                default:
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

    const formattedOptions = options?.map(opt => {
        return {
            label: opt[labelField],
            value: opt[valueField],
        };
    });
    return formattedOptions ? sortOptions(formattedOptions) : sortOptions([]);
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
                [path[0]]: value?.startDate ? value.startDate : null,
                [path[1]]: value?.endDate ? value.endDate : null,
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

const getFieldCurrentValue = (initialData, fieldName) => {
    const v = get(initialData, fieldName, '');
    if (v && isObject(v)) {
        const value = get(initialData, `${fieldName}.value`, '');
        if (value !== '') {
            return value;
        }
    }
    return v;
};

const toShow = (field, initialData, prefix) => {
    const showWhen = get(field, 'showWhen', []);
    const preString = prefix ? `${prefix}.` : '';
    if (showWhen.length) {
        let retValue = false;
        field.showWhen.forEach(conditionObj => {
            // OR condition
            if (Array.isArray(conditionObj)) {
                // AND condition
                let areAllTrue = true;
                conditionObj.forEach(obj => {
                    const value = getFieldCurrentValue(initialData, `${preString}${obj.field}`);
                    if (obj.hasValue === 'any') {
                        areAllTrue = !value ? false : areAllTrue;
                    } else if (value !== obj.hasValue) {
                        areAllTrue = false;
                    }
                });
                retValue = areAllTrue ? true : retValue;
            } else {
                const value = getFieldCurrentValue(initialData, `${preString}${conditionObj.field}`);
                if (value === conditionObj.hasValue) {
                    // if we have value === conditionObj.hasValue and conditionObj.operation = 'notEqual'
                    // then we will return false which will not allow to display this element in this case
                    retValue = conditionObj.operation !== 'notEqual';
                }
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
        prefix,
        isTitlePage,
        setUpdate,
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
                            initialData={initialData}
                            prefix={prefix}
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
                                isTitlePage,
                                setUpdate,
                            })}
                        </div>
                    ))
                );
            })}
        </div>
    );
};

export const hebrew = /[\u0590-\u05FF]/;

export const getDir = value => {
    return hebrew.test(value) ? 'rtl' : 'ltr';
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
        setUpdatedValues,
        updatedValues,
        prefix,
        isTitlePage,
        setUpdate,
        allData,
    }
) => {
    return toShow(field, updatedValues || initialData, prefix) ? (
        <Restricted resource={field.resource}>
            <NexusField
                {...field}
                id={key}
                key={key}
                name={key}
                label={field.name}
                view={view}
                getValues={getValues}
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
                setUpdatedValues={setUpdatedValues}
                isTitlePage={isTitlePage}
                setUpdate={setUpdate}
                allData={allData}
            />
        </Restricted>
    ) : null;
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

export const getLabel = (label, isRequired, isRequiredVZ) => {
    return `${label}${isRequired ? '*' : isRequiredVZ ? '**' : ''}: `;
};

export const renderLabel = (label, isRequired, tooltip, isGridLayout, isRequiredVZ, oneIsRequiredVZ) => {
    const tooltipText = isRequiredVZ ? MANDATORY_VZ : oneIsRequiredVZ ? ONE_MANDATORY_VZ : undefined;
    return (
        <div
            className={classnames('nexus-c-field__label', {
                'nexus-c-field__label--grid': isGridLayout,
            })}
        >
            {tooltipText ? (
                <span title={tooltipText}>{getLabel(label, isRequired, isRequiredVZ || oneIsRequiredVZ)}</span>
            ) : (
                getLabel(label, isRequired, isRequiredVZ || oneIsRequiredVZ)
            )}
            {tooltip && (
                <span title={tooltip} style={{color: 'grey'}}>
                    <i className="far fa-question-circle" />
                </span>
            )}
        </div>
    );
};

export const renderError = validationError => {
    return (
        <div className="nexus-c-field__error">
            <ErrorMessage>{validationError}</ErrorMessage>
        </div>
    );
};

export const createUrl = (linkConfig, initialData) => {
    const {baseUrl, contentType, contentSubType} = linkConfig;
    const parentIds = get(initialData, 'parentIds', []);
    const id = parentIds.filter(parent => parent.contentType === contentType || parent.contentType === contentSubType);
    if (id.length) {
        return baseUrl + id[0].id;
    }
    return initialData.id;
};
