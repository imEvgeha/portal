import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../ui/elements/nexus-grid/constants';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '../../../ui/elements/nexus-grid/hoc/withEditableColumns';
import withFilterableColumns from '../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../ui/elements/nexus-grid/hoc/withSorting';
import {PRE_PLAN_TAB} from '../rights-repository/constants';

const PrePlanGrid = compose(
    withColumnsResizing(),
    withSideBar(),
    withEditableColumns(),
    withFilterableColumns(),
    withSorting(),
)(NexusGrid);


const PreplanRightsTable = ({columnDefs, mapping, prePlanRepoRights, activeTab}) => {
    const planTerritoriesColumn = {
        headerName: 'Plan Territories',
        colId: 'planTerritories',
        field: 'planTerritories',
        editable: true,
        // cellRendererFramework:
    };

    const updatedMapping = {
        'javaVariableName': 'planTerritories',
        'displayName': 'Plan Territories',
        'dataType': 'multiselect',
        'queryParamName': 'planTerritories',
        'readOnly': true,
        'enableSearch': true,
        'enableEdit': true,
        'required': true,
    };

    const onGridReady = ({type, columnApi}) => {
        if (type === GRID_EVENTS.READY) {
            const columnPosition = 10;
            columnApi.moveColumn('planTerritories', columnPosition);
        }
    };

    return (
        <PrePlanGrid
            id="prePlanRightsRepo"
            columnDefs={[...columnDefs, planTerritoriesColumn]}
            singleClickEdit
            rowSelection="multiple"
            suppressRowClickSelection={true}
            mapping={[...mapping, updatedMapping]}
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
    activeTab: PropTypes.string.isRequired,
};

PreplanRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    prePlanRepoRights: [],
};

export default PreplanRightsTable;
