import moment from 'moment';
import Constants from './Constants';
import isEqual from 'lodash.isequal';
import get from 'lodash.get';
import {store} from '../../index';
import {getDateFormatBasedOnLocale} from '../../util/Common';
import {TIMESTAMP_FORMAT} from '../../ui-elements/nexus-date-and-time-elements/constants';

const { dataTypes: {DATE, AUDIO, RATING, METHOD},
    colors: {CURRENT_VALUE, STALE_VALUE}, RATING_SUBFIELD,
    method: {MANUAL, INGEST},
    INGEST_METHOD_URL,
} = Constants;

const languageMapper = audioObj => [...new Set(audioObj.map(audio => audio.language))];

export const valueFormatter = ({colId, field, dataType}) => {
    const {locale} = store.getState().localeReducer;

    // Create date placeholder based on locale
    const dateFormat = `${getDateFormatBasedOnLocale(locale)} ${TIMESTAMP_FORMAT}`;

    switch (dataType) {
        case DATE:
            return (params) => {
                const {data = {}} = params || {};
                const {[field]: date = ''} = data || {};
                const isUTC = typeof date === 'string' && date.endsWith('Z');

                return moment(date).isValid() ? moment(date).utc(!isUTC).format(dateFormat) : '';
            };
        case RATING:
            return (params) => {
                const {data = {}} = params || {};
                return get(data, [field, RATING_SUBFIELD, colId]) || get(data, [field, colId]) || '';
            };
        case AUDIO:
            return (params) => {
                const {data = {}} = params || {};
                const languages = data[field] && languageMapper(data[field]);
                return languages && languages.join(', ').toUpperCase() || '';
            };
        case METHOD:
            return (params) => {
                const {data, data: {headerRow, updatedBy} = {}} = params || {};
                return headerRow ? data[field] : (updatedBy === INGEST_METHOD_URL ? INGEST : MANUAL);
            };
        default:
            return (params) => {
                const {data = {}} = params || {};
                return data[field];
            };
    }
};

const valueCompare = (diffValue, currentValue, column) => {
    const {colId, dataType} = column;
    let diff, current;
    if(currentValue){
        switch(dataType){
            case RATING:
                diff = get(diffValue, [RATING_SUBFIELD, colId], null);
                current = get(currentValue, [colId], null);
                return diff &&       //returns null value to prevent coloring
                    (diff === current);
            case AUDIO:
                return isEqual(languageMapper(diffValue), languageMapper(currentValue));
            default:
                return isEqual(diffValue, currentValue);
        }
    }
    return false;
};

export const cellStyling = ({data = {}, value}, focusedRight, column) => {
    const styling = {};
    const {field, noStyles, colId} = column;
    if(value && Object.keys(value).length && !data.headerRow && !noStyles){
        const equalityCheck = valueCompare(value, focusedRight[field], column);
        if(equalityCheck){
            styling.background = CURRENT_VALUE;
        } else if(equalityCheck === false){     //for null valued rating field we dont need to color the cell
            styling.background = STALE_VALUE;
        }
    }
    if (data[`${colId || field}Deleted`]) {
        styling.textDecoration = 'line-through';
        const path = field === RATING ? [field, colId] : [field];
        if(get(focusedRight, path, '').length){
            styling.background = STALE_VALUE;
        } else{
            styling.background = CURRENT_VALUE;
        }
    }
    return styling;
};

export const formatData = data => {
    const { eventHistory, diffs } = data;
    let tableRows = eventHistory.map((dataObj, index) => {
        const {message : {updatedBy, createdBy, lastUpdateReceivedAt}} = dataObj;
        const row = {};
        diffs[index].forEach(diff => {
            const {path, op} = diff;
            const field = path.split('/')[2];   //as path is always like '/message/field/sub-field'
            const valueUpdated = dataObj.message[field];
            if(op === 'remove'){
                row[field] = get(eventHistory[index-1], ['message', field], '');
                row[`${field}Deleted`] = true;
            }else{
                row[field] = Array.isArray(valueUpdated) ? [...new Set(valueUpdated)] : valueUpdated;
            }
            if(field === RATING){
                const subField = path.split('/')[4];
                if(subField){
                    row[field] = {
                        [RATING_SUBFIELD]: {
                            [subField]: get(row, [field, RATING_SUBFIELD, subField], '')
                        }
                    };
                    if(op === 'remove'){
                        row[`${subField}Deleted`] = true;
                    }
                }
            }
        });
        row.updatedBy = updatedBy || createdBy;
        row.lastUpdateReceivedAt = lastUpdateReceivedAt;
        return row;
    });
    tableRows[0] = eventHistory[0].message;
    tableRows = tableRows.reverse();
    return tableRows;
};
