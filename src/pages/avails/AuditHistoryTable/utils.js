import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import * as jsonpatch from 'fast-json-patch';
import {get, isEqual, cloneDeep} from 'lodash';
import Constants from './Constants';

const {
    dataTypes: {DATE, AUDIO, RATING, METHOD, YES_OR_NO, TERRITORY, TERRITORY_SELECTED, TERRITORY_WITHDRAWN},
    colors: {CURRENT_VALUE, STALE_VALUE},
    RATING_SUBFIELD,
    method: {MANUAL, INGEST},
    INGEST_ACCOUNTS,
} = Constants;

const languageMapper = audioObj => [...new Set(audioObj.map(audio => audio.language))];
const countryMapper = territoryObj => [...new Set(territoryObj.map(territory => territory.country))];
const selectedCountryMapper = territoryObj => [
    ...new Set(territoryObj.filter(territory => territory.selected).map(territory => territory.country)),
];
const withdrawnCountryMapper = territoryObj => [
    ...new Set(territoryObj.filter(territory => territory.withdrawn).map(territory => territory.country)),
];

export const valueFormatter = ({colId, field, dataType}) => {
    return params => {
        const {data = {}} = params || {};
        if (data) {
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
                case YES_OR_NO:
                    const value = typeof data[field] === 'boolean' ? data[field] : null;
                    if (value === null) return '';
                    return value ? 'Yes' : 'No';
                case TERRITORY:
                    if (Array.isArray(data[field])) {
                        return data[field]
                            .filter(Boolean)
                            .map(item => item.country)
                            .join(', ');
                    }
                    return '';
                case TERRITORY_SELECTED:
                    if (Array.isArray(data[field])) {
                        return data[field]
                            .filter(item => item.selected)
                            .map(item => item.country)
                            .join(', ');
                    }
                    return '';
                case TERRITORY_WITHDRAWN:
                    if (Array.isArray(data[field])) {
                        return data[field]
                            .filter(item => item.withdrawn)
                            .map(item => item.country)
                            .join(', ');
                    }
                    return '';
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
    let diff; let current;
    if (currentValue) {
        switch (dataType) {
            case RATING:
                diff = get(diffValue, [RATING_SUBFIELD, colId], null);
                current = get(currentValue, [colId], null);
                return (
                    diff && diff === current // returns null value to prevent coloring
                );
            case AUDIO:
                return isEqual(languageMapper(diffValue), languageMapper(currentValue));
            case TERRITORY:
                return isEqual(countryMapper(diffValue), countryMapper(currentValue));
            case TERRITORY_SELECTED:
                return isEqual(selectedCountryMapper(diffValue), selectedCountryMapper(currentValue));
            case TERRITORY_WITHDRAWN:
                return isEqual(withdrawnCountryMapper(diffValue), withdrawnCountryMapper(currentValue));
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
            // for null valued rating field we dont need to color the cell
            styling.background = STALE_VALUE;
        }
    } else if (typeof value === 'boolean' && !data.headerRow && !noStyles) {
        const equalityCheck = valueCompare(value, focusedRight[field], column);
        if (equalityCheck) {
            styling.background = CURRENT_VALUE;
        } else if (equalityCheck === false) {
            // for null valued rating field we dont need to color the cell
            styling.background = STALE_VALUE;
        }
    }
    if (!!data && data[`${colId || field}Deleted`]) {
        if (Array.isArray(data[field]) && get(focusedRight, field, []).length) {
            styling.textDecoration = 'none';
        } else {
            styling.textDecoration = 'line-through';
        }
        const path = field === RATING ? [field, colId] : [field];
        if (field === RATING || !Array.isArray(focusedRight[path])) {
            const fldVal = get(focusedRight, path) || '';
            if (fldVal.length) {
                styling.background = STALE_VALUE;
            } else {
                styling.background = CURRENT_VALUE;
            }
        }
    }
    return styling;
};

export const formatData = data => {
    const {originalEvent, diffs} = data;
    const {
        message: {updatedBy, createdBy, lastUpdateReceivedAt},
    } = originalEvent;
    let temporaryValues = cloneDeep(originalEvent);
    let tableRows = diffs.map(diffArr => {
        const row = {};
        diffArr.forEach(diff => {
            const {path, op} = diff;
            const splittedPath = path.split('/');
            const originalEventField = splittedPath[1];
            const field = splittedPath[2];

            const patch = [{...diff}];
            temporaryValues = jsonpatch.applyPatch(temporaryValues, patch).newDocument;
            const newValue = get(temporaryValues, [originalEventField, field]);
            row[field] = cloneDeep(newValue);
            if (op === 'remove') {
                row[`${field}Deleted`] = true;
            }

            if (field === RATING) {
                const subField = splittedPath[4];
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
