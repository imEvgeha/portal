import {get} from 'lodash';
import {equalOrIncluded} from '../../../util/Common';
import {VIEWS} from './constants';

export const getDefaultValue = (field = {}, view, data) => {
    return view === VIEWS.CREATE ? get(field, 'defaultValueCreate') : get(data, field.path);
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

export const getValidationFunction = (value, customValidation) => {
    // load dynamic file
    if (customValidation) {
        return import(`./valdationUtils/${customValidation}.js`).then(math => {
            return math[`${customValidation}`](value);
        });
    }
};
