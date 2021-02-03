import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {compose} from 'redux';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import Loading from '../../static/Loading';
import {PRE_PLAN_TAB} from '../rights-repository/constants';
import {
    planTerritoriesColumn,
    planTerritoriesMapping,
    territoriesColumn,
    territoriesMapping,
    COLUMNS_TO_REORDER,
    INSERT_FROM,
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
    setPrePlanColumnApi,
    setPrePlanGridApi,
}) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (activeTab === PRE_PLAN_TAB) {
            setCount(0);
            updateRightDetails();
        }
    }, [activeTab]);

    const updateRightDetails = () => {
        let updatedPrePlanRepo = prePlanRepoRights;
        prePlanRepoRights.forEach(right =>
            rightsService
                .get(right.id, {isWithErrorHandling: true})
                .then(result => {
                    setCount(prevCount => prevCount + 1);
                    const oldRecord = prePlanRepoRights.find(p => p.id === right.id);
                    const dirtyTerritories = oldRecord.territory.filter(t => t.isDirty);

                    // if the territory is not withdrawn and not selected, keep it in plan else remove the selected flag
                    const updatedTerritories = result.territory.map(t => {
                        const dirtyTerritoryFound = dirtyTerritories.find(o => o.country === t.country);
                        if (!t.withdrawn && !t.selected && dirtyTerritoryFound)
                            return {...t, selected: dirtyTerritoryFound.selected, isDirty: true};
                        return t;
                    });
                    const updatedResult = {
                        ...result,
                        keywords: oldRecord.keywords,
                        territory: updatedTerritories.filter(t => ((!t.selected && !t.isDirty) || t.isDirty)),
                        territorySelected: result.territory.filter(item => item.selected).map(t => t.country),
                        territoryAll: result.territory.map(item => item.country).join(', '),
                    };
                    const prePlanRight = updatedPrePlanRepo.filter(p => p.id !== right.id);
                    updatedPrePlanRepo = [...prePlanRight, updatedResult];
                    setPreplanRights({[username]: updatedPrePlanRepo});
                })
                .catch(error => {
                    setCount(prevCount => prevCount + 1);
                    updatedPrePlanRepo = updatedPrePlanRepo.filter(p => p.id !== right.id);
                    setPreplanRights({[username]: updatedPrePlanRepo});
                })
        );
    };

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
            case GRID_EVENTS.READY: {
                setPrePlanColumnApi(columnApi);
                setPrePlanGridApi(api);
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

    const reorderColumns = defs => {
        const updatedColumnDefs = [...defs];
        COLUMNS_TO_REORDER.forEach((colHeader, headerIndex) => {
            const index = updatedColumnDefs.findIndex(el => el.headerName === colHeader);
            if (index >= 0) {
                updatedColumnDefs.splice(INSERT_FROM + headerIndex, 0, updatedColumnDefs[index]);
                updatedColumnDefs.splice(index, 1);
            }
        });
        return updatedColumnDefs;
    };

    return activeTab === PRE_PLAN_TAB && count < prePlanRepoRights.length ? (
        <Loading />
    ) : (
        <PrePlanGrid
            id="prePlanRightsRepo"
            columnDefs={reorderColumns([...filteredColumnDefs, planTerritoriesColumn, territoriesColumn])}
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
    setPrePlanColumnApi: PropTypes.func,
    setPrePlanGridApi: PropTypes.func,
};

PreplanRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    prePlanRepoRights: [],
    setPrePlanColumnApi: () => null,
    setPrePlanGridApi: () => null,
};

export default PreplanRightsTable;
