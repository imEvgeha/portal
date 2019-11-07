import moment from 'moment';
import Constants from './Constants';

const { DATE, AUDIO, AFFILIATE, RATING, FORMAT } = Constants.dataTypes;

export const valueFormatter = ({colId, field, dataType}) => {
    switch (dataType) {
        case DATE:
            return (params) => {
                const {data = {}} = params || {};
                if ((data[field]) && moment(data[field].toString().substr(0, 10)).isValid()) {
                    return moment(data[field].toString().substr(0, 10)).format('L');
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
                return data[field] && data[field][0] && data[field][0].toUpperCase() || '';
            };
        case AFFILIATE:
            return (params) => {
                const {data = {}} = params || {};
                return (data[field] && data[field][0]) ? data[field][0].value : '';
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
    switch(dataType){
        case RATING:
            return diffValue[colId] === currentValue[colId];
        case FORMAT:
        case AUDIO:
            return diffValue[0] === currentValue[0];
        case AFFILIATE:
            return currentValue[0] && (diffValue[0].value === currentValue[0].value);
        default:
            return diffValue === currentValue;
    }
};

export const cellStyling = ({data = {}, value}, focusedRight, column) => {
    const styling = {};
    const {colId, field, noStyles} = column;
    if(value && Object.keys(value).length && !data.headerRow && !noStyles){
        if(valueCompare(value, focusedRight[field], column)){
            styling.background = 'LightGreen';
        } else{
            styling.background = 'coral';
        }
    }
    if (data[`${colId || field}Deleted`]) {
        styling.textDecoration = 'line-through';
        if(focusedRight[colId] === ''){
            styling.background = 'LightGreen';
        } else{
            styling.background = 'coral';
        }
    }
    return styling;
};

export const formatData = data => {
    const { eventHistory, diffs } = data;
    let tableRows = eventHistory.map((dataObj, index) => {
        const row = {};
        diffs[index].forEach(diff => {
            const {op, path, value} = diff;
            const field = path.substr(1);
            switch(op){
                case 'add':
                case 'replace':
                    row[field] = value;
                    break;

                case 'remove':
                    row[field] = value;
                    row[`${field}Deleted`] = true;
                    break;

                default:
                    break;
            }
        });
        row.updatedBy = dataObj.updatedBy || dataObj.createdBy;
        row.lastUpdateReceivedAt = dataObj.lastUpdateReceivedAt;
        return row;
    });
    tableRows = tableRows.reverse();
    return tableRows;
};