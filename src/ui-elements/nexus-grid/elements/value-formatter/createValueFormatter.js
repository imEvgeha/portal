import moment from 'moment';

const createValueFormatter = ({dataType, javaVariableName}) => {
    switch (dataType) {
        case 'localdate':
        case 'datetime':
            return (params) => {
            const {data = {}} = params || {};
            if (data[javaVariableName]) {
                return `${moment(data[javaVariableName]).format('L')} ${moment(data[javaVariableName]).format('HH:mm')}`;
            }
        };
        case 'date':
            return (params) => {
            const {data = {}} = params || {};
            if ((data[javaVariableName]) && moment(data[javaVariableName].toString().substr(0, 10)).isValid()) {
                return moment(data[javaVariableName].toString().substr(0, 10)).format('L');
            }
        };
        case 'territoryType':
            return (params) => {
            const {data = {}} = params || {};
            if (data && data[javaVariableName]) {
                return data[javaVariableName].filter(Boolean).map(e => String(e.country)).join(', ');
            }
        };
        case 'string': 
            if (javaVariableName === 'castCrew') {
            return (params) => {
                const {data = {}} = params || {};
                if (data[javaVariableName]) {
                    const result = data[javaVariableName]
                    .map(({personType, displayName}) => `${personType}: ${displayName}`)
                    .join('; ');
                    return result;
                }
            };
        }
        return;
        default: return null;
    }
}; 

export default createValueFormatter;

