import createLoadingCellRenderer from '../ui-elements/nexus-grid/elements/cell-renderer/createLoadingCellRenderer';
import createValueFormatter from '../ui-elements/nexus-grid/elements/value-formatter/createValueFormatter';

export function createColumnDefs(payload) {
    return payload.reduce((columnDefs, column) => {
        const {javaVariableName, displayName, id} = column;
        const columnDef = {
            field: javaVariableName,
            headerName: displayName,
            colId: id,
            cellRenderer: createLoadingCellRenderer,
            valueFormatter: createValueFormatter(column),
            width: 150,
        };
        return [...columnDefs, columnDef];
    }, []);
}
