import moment from 'moment';
import Constants from './Constants';
import isEqual from 'lodash.isequal';
import jsonpatch from 'fast-json-patch';

const { dataTypes: {DATE, AUDIO, RATING}, colors: {CURRENT_VALUE, STALE_VALUE} } = Constants;

const languageMapper = audioObj => [...new Set(audioObj.map(audio => audio.language))];

export const valueFormatter = ({colId, field, dataType}) => {
    switch (dataType) {
        case DATE:
            return (params) => {
                const {data = {}} = params || {};
                if ((data[field])) {
                    const date = new Date(data[field]);
                    return isNaN(date.getTime()) ? data[field] : moment(date).format('L');
                }
            };
        case RATING:
            return (params) => {
                const {data = {}} = params || {};
                return data[field] && data[field][colId] || '';
            };
        case AUDIO:
            return (params) => {
                const {data = {}} = params || {};
                const languages = data[field] && languageMapper(data[field]);
                return languages && languages.join(', ').toUpperCase() || '';
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
    if(currentValue){
        switch(dataType){
            case RATING:
                return diffValue[colId] === currentValue[colId];
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
    const {colId, field, noStyles} = column;
    if(value && Object.keys(value).length && !data.headerRow && !noStyles){
        if(valueCompare(value, focusedRight[field], column)){
            styling.background = CURRENT_VALUE;
        } else{
            styling.background = STALE_VALUE;
        }
    }
    if (data[`${colId || field}Deleted`]) {
        styling.textDecoration = 'line-through';
        if(focusedRight[colId] === ''){
            styling.background = CURRENT_VALUE;
        } else{
            styling.background = STALE_VALUE;
        }
    }
    return styling;
};

export const formatData = data => {
    const { eventHistory, diffs } = data;
    let tableRows = eventHistory.map((dataObj, index) => {
        const result = jsonpatch.applyPatch(dataObj, diffs[index]).newDocument.message;
        const {message : {updatedBy, createdBy, lastUpdateReceivedAt}} = dataObj;
        const row = {};
        diffs[index].forEach(diff => {
            const {path} = diff;
            const field = path.split('/')[2];   //as path is always like '/message/field/sub-field'
            row[field] = Array.isArray(result[field]) ? [...new Set(result[field])] : result[field];
        });
        row.updatedBy = updatedBy || createdBy;
        row.lastUpdateReceivedAt = lastUpdateReceivedAt;
        return row;
    });
    tableRows = tableRows.reverse();
    return tableRows;
};