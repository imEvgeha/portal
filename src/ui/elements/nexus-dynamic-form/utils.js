import {get} from 'lodash';
import config from 'react-global-configuration';
import {equalOrIncluded, getSortedData} from '../../../util/Common';
import {nexusFetch} from '../../../util/http-client/index';
import {VIEWS} from './constants';

export const getDefaultValue = (field = {}, view, data) => {
    return view === VIEWS.CREATE
        ? get(field, 'defaultValueCreate')
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

export const getValidationFunction = (value, customValidation) => {
    // load dynamic file
    if (customValidation) {
        return import(`./valdationUtils/${customValidation}.js`).then(math => {
            return math[`${customValidation}`](value);
        });
    }
    return undefined;
};

export const fetchSelectValues = endpoint => {
    const url = `${config.get('gateway.configuration')}/configuration-api/v1${endpoint}?page=0&size=10000`;
    return nexusFetch(url, {isWithErrorHandling: false});
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
        if (typeof values[key] === 'object') {
            if (Array.isArray(values[key])) {
                values[key] = values[key].map(val => {
                    if (typeof val !== 'string') {
                        return val.value;
                    }
                    return val;
                });
            } else {
                values[key] = values[key].value;
            }
        }
    });
};
