import {get} from 'lodash';
import {equalOrIncluded} from '../../../util/Common';
import {length} from './valdationUtils/length.js';
import {VIEWS} from './constants';

export const getFieldConfig = (field, config, view) => {
    return field && field.viewConfig && field.viewConfig.find(c => view === c.view && get(c, config));
};

export const getDefaultValue = (field = {}, view, data) => {
    return getFieldConfig(field, 'defaultValue', view)
        ? getFieldConfig(field, 'defaultValue', view)
        : get(data, field.path) !== null
        ? get(data, field.path)
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
            return dependencyValue && (dependencyValue === value || !value);
        })
    );
};

export const getValidationFunction = (value, validations) => {
    // load dynamic file
    if (validations && validations.length > 0) {
        return validations
            .map(v =>
                import(`./valdationUtils/${v.name}.js`).then(f => {
                    return f[`${v.name}`](value);
                })
            )
            .find(e => e !== undefined);
    }
    return undefined;
};
