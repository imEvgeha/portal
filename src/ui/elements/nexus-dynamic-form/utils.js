import {get} from 'lodash';
import {equalOrIncluded} from '../../../util/Common';
import {VIEWS} from './constants';

export const getFieldConfig = (field, config, view) => {
    const viewConfig = field && field.viewConfig && field.viewConfig.find(c => view === c.view && get(c, config));
    return viewConfig && viewConfig[config];
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
    return get(data, field.path) !== null ? get(data, field.path) : '';
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
    let allFields = {};
    const fields = schema.map(s => s.sections.map(e => e.fields)).flat();
    fields.forEach(section => {
        allFields = {...allFields, ...section};
    });
    return allFields;
};

export const getFieldByName = (allFields, name) => {
    const key = Object.keys(allFields).find(key => allFields[key].name === name);
    return get(allFields, [key]);
};

export const getProperValue = (type, value, path) => {
    let val = '';
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
        default:
            val = value;
    }
    return Array.isArray(path) ? val : {[path]: val};
};
