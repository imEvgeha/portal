import Constants from './Constants';
import {get, isEqual} from 'lodash';
import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';

const {
    dataTypes: {DATE, AUDIO, RATING, METHOD},
    colors: {CURRENT_VALUE, STALE_VALUE},
    RATING_SUBFIELD,
    method: {MANUAL, INGEST},
    INGEST_ACCOUNTS,
} = Constants;

const languageMapper = audioObj => [...new Set(audioObj.map(audio => audio.language))];

export const valueFormatter = ({colId, field, dataType}) => {
    return params => {
        const {data = {}} = params || {};
        if (!!data) {
            switch (dataType) {
                case DATE:
                    const {[field]: date = ''} = data || {};

                    if (data.separationRow) {
                        return date;
                    }

                    return ISODateToView(date, DATETIME_FIELDS.BUSINESS_DATETIME);
                case RATING:
                    return get(data, [field, RATING_SUBFIELD, colId]) || get(data, [field, colId]) || '';
                case AUDIO:
                    const languages = data[field] && languageMapper(data[field]);
                    return (languages && languages.join(', ').toUpperCase()) || '';
                case METHOD:
                    const {data: {headerRow, updatedBy} = {}} = params || {};
                    return headerRow ? data[field] : INGEST_ACCOUNTS.includes(updatedBy) ? INGEST : MANUAL;
                default:
                    return data[field];
            }
        } else {
            return '';
        }
    };
};

const valueCompare = (diffValue, currentValue, column) => {
    const {colId, dataType} = column;
    let diff, current;
    if (currentValue) {
        switch (dataType) {
            case RATING:
                diff = get(diffValue, [RATING_SUBFIELD, colId], null);
                current = get(currentValue, [colId], null);
                return (
                    diff && diff === current //returns null value to prevent coloring
                );
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
    if (value && Object.keys(value).length && !data.headerRow && !noStyles) {
        const equalityCheck = valueCompare(value, focusedRight[field], column);
        if (equalityCheck) {
            styling.background = CURRENT_VALUE;
        } else if (equalityCheck === false) {
            //for null valued rating field we dont need to color the cell
            styling.background = STALE_VALUE;
        }
    }
    if (!!data && data[`${colId || field}Deleted`]) {
        styling.textDecoration = 'line-through';
        const path = field === RATING ? [field, colId] : [field];
        if (get(focusedRight, path, '').length) {
            styling.background = STALE_VALUE;
        } else {
            styling.background = CURRENT_VALUE;
        }
    }
    return styling;
};

export const formatData = data => {
    const {originalEvent, diffs} = data;
    const {
        message: {updatedBy, createdBy, lastUpdateReceivedAt},
    } = originalEvent;
    let tableRows = diffs.map(diffArr => {
        const row = {};
        diffArr.forEach(diff => {
            const {path, op, value} = diff;
            const field = path.split('/')[2];
            if (op === 'remove') {
                const originalEventField = path.split('/')[1];
                row[field] = get(originalEvent, [originalEventField, field]);
                row[`${field}Deleted`] = true;
            } else {
                row[field] = Array.isArray(value) ? [...new Set(value)] : value;
            }
            if (field === RATING) {
                const subField = path.split('/')[4];
                if (subField) {
                    if (op === 'remove') {
                        row[`${subField}Deleted`] = true;
                    }
                }
            }
        });
        row.updatedBy = updatedBy || createdBy;
        row.lastUpdateReceivedAt = lastUpdateReceivedAt;
        return row;
    });
    tableRows[0] = originalEvent.message;
    tableRows = tableRows.reverse();
    return tableRows;
};
