import createValueFormatter from '../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';

export const planTerritoriesColumn = {
    headerName: 'Plan Territories',
    colId: 'territory',
    field: 'territory',
    width: 180,
    editable: true,
    cellRenderer: 'loadingCellRenderer',
    optionsKey: 'territory',
    disabledOptionsKey: 'territoryExcluded',
    valueFormatter: createValueFormatter({dataType: 'dropdown'}),
};

export const planTerritoriesMapping = {
    javaVariableName: 'territory',
    displayName: 'Plan Territories',
    dataType: 'dropdown',
    queryParamName: 'territory',
    readOnly: true,
    enableSearch: true,
    enableEdit: true,
    required: true,
};

export const territoriesMapping = {
    javaVariableName: 'territoryAll',
    displayName: 'All Territories',
    dataType: 'string',
};

export const territoriesColumn = {
    headerName: 'All Territories',
    colId: 'territoryAll',
    field: 'territoryAll',
    width: 180,
};

export const COLUMN_POSITION = 7;
