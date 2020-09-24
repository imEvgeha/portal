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
                error += `, original value:  '${  fieldValidationError.sourceDetails.originalValue  }'`;
            if (fieldValidationError.sourceDetails.fileName) {
                error +=
                    `, in file ${ 
                    fieldValidationError.sourceDetails.fileName 
                    }, row number ${ 
                    fieldValidationError.sourceDetails.rowId 
                    }, column ${ 
                    fieldValidationError.sourceDetails.originalFieldName}`;
            }
        }
    }
    return error;
};
