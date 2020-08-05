import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../ui/elements/nexus-grid/constants';
import createValueFormatter from '../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '../../../ui/elements/nexus-grid/hoc/withEditableColumns';
// import withFilterableColumns from '../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import {PRE_PLAN_TAB} from '../rights-repository/constants';

const PrePlanGrid = compose(
    withColumnsResizing(),
    withSideBar(),
    withEditableColumns()
    // withFilterableColumns()
)(NexusGrid);

const PreplanRightsTable = ({columnDefs, mapping, prePlanRepoRights, activeTab, setPreplanRights}) => {
    const filteredColumnDefs = columnDefs.filter(columnDef => columnDef.colId !== 'selected');
    const editedMappings = mapping.map(mapping => {
        if (mapping.javaVariableName === 'keywords') {
            return {
                ...mapping,
                enableEdit: true,
            };
        }
        return {
            ...mapping,
            enableEdit: false,
        };
    });

    const planTerritoriesColumn = {
        headerName: 'Plan Territories',
        colId: 'planTerritories',
        field: 'planTerritories',
        width: 180,
        editable: true,
        cellRenderer: 'loadingCellRenderer',
        optionsKey: 'territory',
        newOptionsKey: 'planTerritories',
        disabledOptionsKey: 'territoryExcluded',
        valueFormatter: createValueFormatter({dataType: 'dropdown'}),
    };

    const planTerritoriesMapping = {
        javaVariableName: 'planTerritories',
        displayName: 'Plan Territories',
        dataType: 'dropdown',
        queryParamName: 'planTerritories',
        readOnly: true,
        enableSearch: true,
        enableEdit: true,
        required: true,
    };

    const onGridReady = ({type, columnApi, api, data}) => {
        const result = [];
        if (type === GRID_EVENTS.FIRST_DATA_RENDERED) {
            const idIndex = columnDefs.findIndex(e => e.field === 'id');
            // move column to position of id col position + 8 because we use columnDefs from RightsRepo
            const columnPosition = 8;
            columnApi.moveColumn('planTerritories', idIndex + columnPosition);
        }
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED && data.planTerritories) {
            api.forEachNode(({data = {}}) => {
                const {planTerritories} = data || {};
                planTerritories ? result.push({...data, planTerritories}) : result.push(data);
            });
            setPreplanRights(result);
        }
    };

    return (
        <PrePlanGrid
            id="prePlanRightsRepo"
            columnDefs={[...filteredColumnDefs, planTerritoriesColumn]}
            singleClickEdit
            rowSelection="multiple"
            suppressRowClickSelection={true}
            mapping={[...editedMappings, planTerritoriesMapping]}
            rowData={prePlanRepoRights}
            isGridHidden={activeTab !== PRE_PLAN_TAB}
            onGridEvent={onGridReady}
            notFilterableColumns={['action', 'buttons']}
        />
    );
};

PreplanRightsTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    prePlanRepoRights: PropTypes.array,
    setPreplanRights: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
};

PreplanRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    prePlanRepoRights: [],
};

export default PreplanRightsTable;
