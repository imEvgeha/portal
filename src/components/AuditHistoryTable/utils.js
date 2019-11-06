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
                return data[field] && data[field][0].toUpperCase() || '';
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

const valueCompare = (diffValue, currentValue, colDef) => {
    switch(colDef.dataType){
        case RATING:
            return diffValue[colDef.colId] === currentValue[colDef.colId];
        case FORMAT:
        case AUDIO:
            return diffValue[0] === currentValue[0];
        case AFFILIATE:
            return currentValue[0] && (diffValue[0].value === currentValue[0].value);
        default:
            return diffValue === currentValue;
    }
};

export const cellStyling = ({data = {}, column, value}, focusedRight) => {
    const styling = {};
    const {colId, colDef} = column || {};
    if(value && Object.keys(value).length && !data.headerRow && !colDef.noStyles){
        if(valueCompare(value, focusedRight[colDef.field], colDef)){
            styling.background = 'LightGreen';
        } else{
            styling.background = 'coral';
        }
    }
    if (data[`${colId}Deleted`]) {
        styling.textDecoration = 'line-through';
        if(focusedRight[colId] === ''){
            styling.background = 'LightGreen';
        }
    }
    return styling;
};