import moment from 'moment';
import createLoadingCellRenderer from '../ui-elements/nexus-grid/elements/cell-renderer/createLoadingCellRenderer';

function createFormatter({dataType, javaVariableName}) {
    switch (dataType) {
        case 'localdate':
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
                if (data[javaVariableName]) {
                    return data[javaVariableName].map(e => String(e.country)).join(', ');
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
        default:
            return null;
    }
}

export function createColumnDefs(payload) {
    return payload.reduce((columnDefs, column) => {
        const {javaVariableName, displayName, id} = column;
        const columnDef = {
            field: javaVariableName,
            headerName: displayName,
            colId: id,
            cellRenderer: createLoadingCellRenderer,
            valueFormatter: createFormatter(column),
            width: 150,
        };
        return [...columnDefs, columnDef];
    }, []);
}
