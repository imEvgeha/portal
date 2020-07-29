import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../ui/elements/nexus-grid/constants';
import createValueFormatter from '../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '../../../ui/elements/nexus-grid/hoc/withEditableColumns';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import {SELECT_VALUES} from './constants';

const PrePlanGrid = compose(
    withEditableColumns(),
    withColumnsResizing(),
    withSideBar(),
)(NexusGrid);


const PreplanRightsTable = ({columnDefs, mapping, prePlanRepoRights, activeTab, currentTab}) => {
    const [preplanRights, setPreplanRights] = useState(prePlanRepoRights);

    useEffect(() => {
        setPreplanRights(prePlanRepoRights);
    }, [prePlanRepoRights]);

    const planTerritoriesColumn = {
        headerName: 'Plan Territories',
        colId: 'planTerritories',
        field: 'planTerritories',
        editable: true,
        cellRenderer: 'loadingCellRenderer',
        optionsKey: 'territory',
        disabledOptionsKey: 'territoryExcluded',
        valueFormatter: createValueFormatter({dataType: 'dropdown'}),
    };

    const updatedMapping = {
        'javaVariableName': 'planTerritories',
        'displayName': 'Plan Territories',
        'dataType': 'dropdown',
        'queryParamName': 'planTerritories',
        'readOnly': true,
        'enableSearch': true,
        'enableEdit': true,
        'required': true,
    };

    const onGridReady = ({type, columnApi, api, data}) => {
        const result = [];
        if (type === GRID_EVENTS.READY) {
            const columnPosition = 10;
            columnApi.moveColumn('planTerritories', columnPosition);
        }
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED && data.planTerritories) {
            api.forEachNode(({data = {}}) => {
                const {planTerritories: territory} = data || {};
                territory ? result.push({...data, territory}) : result.push(data);
            });
            setPreplanRights(result);
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
            rowData={preplanRights}
            isGridHidden={activeTab !== currentTab}
            onGridEvent={onGridReady}
            notFilterableColumns={['action', 'buttons']}
            selectValues={SELECT_VALUES}
        />
    );
};

PreplanRightsTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    prePlanRepoRights: PropTypes.array,
    activeTab: PropTypes.string.isRequired,
    currentTab: PropTypes.string.isRequired,
};

PreplanRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    prePlanRepoRights: [],
};

export default PreplanRightsTable;
