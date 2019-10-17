import React from 'react';
import createLoadingCellRenderer from '../ui-elements/nexus-grid/elements/cell-renderer/createLoadingCellRenderer';
import createValueFormatter from '../ui-elements/nexus-grid/elements/value-formatter/createValueFormatter';
import Constants from './title-matching/titleMatchingConstants';
import CustomActionsCellRenderer from '../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';

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

export function getRepositoryName(legacy) {
    const {NEXUS, MOVIDA, VZ} = Constants.repository;
    if(legacy) {
        return legacy[MOVIDA] ? MOVIDA : VZ;
    }
    if(legacy === null) {
        return NEXUS;
    }
    return 'movida';
}

const repositoryCell = ({data}) => {// eslint-disable-line
    const {id, legacyIds} = data || {};
    return (
        <CustomActionsCellRenderer id={id}>
            <div className="nexus-c-custom-actions-cell-renderer">{getRepositoryName(legacyIds).toUpperCase()}</div>
        </CustomActionsCellRenderer>
    );
};

export const getRepositoryCell = () => {
    return {
        ...Constants.ADDITIONAL_COLUMN_DEF,
        colId: 'repository',
        field: 'repository',
        headerName: 'Repository',
        cellRendererFramework: repositoryCell,
    };
};
