import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../ui/elements/nexus-grid/constants';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '../../../ui/elements/nexus-grid/hoc/withEditableColumns';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import {PRE_PLAN_TAB} from '../rights-repository/constants';
import {
    planTerritoriesColumn,
    planTerritoriesMapping,
    territoriesColumn,
    territoriesMapping,
    COLUMN_POSITION,
} from './constants';

const PrePlanGrid = compose(withColumnsResizing(), withSideBar(), withEditableColumns())(NexusGrid);

const PreplanRightsTable = ({
    columnDefs,
    mapping,
    prePlanRepoRights,
    activeTab,
    username,
    setPreplanRights,
    setSelectedPrePlanRights,
}) => {
    const filteredColumnDefs = columnDefs.filter(columnDef => columnDef.colId !== 'territoryCountry');
    const editedMappings = mapping
        .filter(mapping => mapping.javaVariableName !== 'territory')
        .map(mapping => {
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

    const onGridReady = ({type, columnApi, api, data}) => {
        const result = [];
        switch (type) {
            case GRID_EVENTS.FIRST_DATA_RENDERED: {
                const idIndex = columnDefs.findIndex(e => e.field === 'id');
                // move column to position of id col position + 7 because we use columnDefs from RightsRepo
                columnApi.moveColumn('territory', idIndex + COLUMN_POSITION);
                columnApi.moveColumn('territoryAll', idIndex + COLUMN_POSITION);
                break;
            }
            case GRID_EVENTS.CELL_VALUE_CHANGED:
                api.forEachNode(({data = {}}) => {
                    const {territory} = data || {};
                    territory ? result.push({...data, territory}) : result.push(data);
                });
                setPreplanRights({[username]: result});
                break;
            case GRID_EVENTS.SELECTION_CHANGED:
                setSelectedPrePlanRights(api.getSelectedRows());
                break;
            default:
                break;
        }
    };

    return (
        <PrePlanGrid
            id="prePlanRightsRepo"
            columnDefs={[...filteredColumnDefs, planTerritoriesColumn, territoriesColumn]}
            singleClickEdit
            rowSelection="multiple"
            suppressRowClickSelection={true}
            mapping={[...editedMappings, planTerritoriesMapping, territoriesMapping]}
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
    username: PropTypes.string.isRequired,
    setSelectedPrePlanRights: PropTypes.func.isRequired,
};

PreplanRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    prePlanRepoRights: [],
};

export default PreplanRightsTable;
