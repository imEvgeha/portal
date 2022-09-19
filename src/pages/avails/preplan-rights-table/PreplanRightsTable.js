import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@portal/portal-auth/authSelectors';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {defineButtonColumn} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import withSelectableRows from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSelectableRows';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {connect, useSelector} from 'react-redux';
import {compose} from 'redux';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import Loading from '../../static/Loading';
import AvailsTableToolbar from '../avails-table-toolbar/AvailsTableToolbar';
import PrePlanActions from '../pre-plan-actions/PrePlanActions';
import {createRightMatchingColumnDefsSelector} from '../right-matching/rightMatchingSelectors';
import TooltipCellRenderer from '../rights-repository/components/tooltip/TooltipCellRenderer';
import {PRE_PLAN_TAB} from '../rights-repository/constants';
import {setPrePlanColumnDef, setPreplanRights} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import {commonDragStoppedHandler, mapColumnDefinitions} from '../rights-repository/util/utils';
import SelectedPreplanTable from './selected-preplan-table/SelectedPreplanTable';
import {
    COLUMNS_TO_REORDER,
    INSERT_FROM,
    planKeywordsColumn,
    planKeywordsMapping,
    planTerritoriesColumn,
    planTerritoriesMapping,
    territoriesColumn,
    territoriesMapping,
} from './constants';
import './PrePlanRightsTable.scss';

const PrePlanGrid = compose(
    withColumnsResizing(),
    withSideBar(),
    withEditableColumns(),
    withSelectableRows()
)(NexusGrid);

const PreplanRightsTable = ({
    columnDefs,
    mapping,
    username,
    setPreplanRights,
    setPrePlanColumnApi,
    setPrePlanGridApi,
    prePlanRights,
    persistSelectedPPRights,
    persistedSelectedRights,
    setPrePlanColumnDef,
}) => {
    const prePlanColumnDef = useSelector(selectors.getPrePlanColumnDefSelector());

    const [count, setCount] = useState(0);
    const [gridApi, setGridApi] = useState(undefined);
    const [columnApiState, setColumnApiState] = useState(undefined);
    const [selectedPPRights, setSelectedPPRights] = useState([]);
    const [showSelected, setShowSelected] = useState(false);
    const [allRights, setAllRights] = useState([]);
    const [singleRightMatch, setSingleRightMatch] = useState([]);
    const [tableColumnDefinitions, setTableColumnDefinitions] = useState([]);
    const [selectedRightsGridApi, setSelectedRightsGridApi] = useState(undefined);
    const [selectedRightsColumnApi, setSelectedRightsColumnApi] = useState(undefined);

    useEffect(() => {
        if (!tableColumnDefinitions.length) {
            // column defs
            const actionMatchingButtonColumnDef = defineButtonColumn({
                cellRendererFramework: TooltipCellRenderer,
                cellRendererParams: {isTooltipEnabled: true, setSingleRightMatch},
                lockVisible: true,
                cellStyle: {overflow: 'visible'},
            });

            const columnDefsClone = mapColumnDefinitions(columnDefs);

            const updatedColumnDefsCheckBoxHeader = columnDefsClone.length
                ? [actionMatchingButtonColumnDef, ...columnDefsClone]
                : columnDefsClone;

            const selectedAtCol = updatedColumnDefsCheckBoxHeader.find(item => item.headerName === 'Selected At');
            const selectedCol = updatedColumnDefsCheckBoxHeader.find(item => item.headerName === 'Selected');
            if (selectedAtCol && selectedCol) {
                selectedAtCol.valueFormatter = selectedCol.valueFormatter;
            }

            const filteredColumnDefs = updatedColumnDefsCheckBoxHeader.filter(
                columnDef => columnDef.colId !== 'territoryCountry'
            );

            const reorderedAndFilteredColumnDefs = reorderColumns([
                ...filteredColumnDefs,
                planTerritoriesColumn,
                territoriesColumn,
                planKeywordsColumn,
            ]);

            setTableColumnDefinitions(reorderedAndFilteredColumnDefs);
        }
    }, [columnDefs]);

    useEffect(() => {
        initRights();
    }, [prePlanRights]);

    useEffect(() => {
        if (persistedSelectedRights.length) {
            const allRightsIds = allRights.map(x => x.id);
            setSelectedPPRights([...persistedSelectedRights.filter(x => allRightsIds.includes(x.id))]);
        }
    }, [allRights]);

    const initRights = () => {
        setCount(0);
        updateRightDetails();
    };

    const updateRightDetails = () => {
        const currentUserPPRights = prePlanRights[username] || [];
        const rightAPIs = currentUserPPRights?.map(right => rightsService.get(right.id, {isWithErrorHandling: true}));

        rightAPIs.length &&
            Promise.all(rightAPIs).then(res => {
                setCount(res.length);
                const updatedRights = [];
                res.forEach(right => {
                    const oldRecord = currentUserPPRights.find(p => p.id === right.id);
                    const dirtyTerritories = oldRecord.territory.filter(t => t.isDirty);

                    // if the territory is not withdrawn and not selected, keep it in plan else remove the selected flag
                    const updatedTerritories = right.territory.map(t => {
                        const dirtyTerritoryFound = dirtyTerritories.find(o => o.country === t.country);
                        if (!t.withdrawn && !t.selected && dirtyTerritoryFound)
                            return {...t, selected: dirtyTerritoryFound.selected, isDirty: true};
                        return t;
                    });
                    const updatedResult = {
                        ...right,
                        planKeywords: oldRecord.planKeywords,
                        territory: updatedTerritories.filter(t => (!t.selected && !t.isDirty) || t.isDirty),
                        territorySelected: right.territory.filter(item => item.selected).map(t => t.country),
                        territoryAll: right.territory.map(item => item.country).join(', '),
                    };
                    updatedRights.push(updatedResult);
                });
                setAllRights(updatedRights);
            });
        !currentUserPPRights.length && setAllRights([]);
    };

    const editedMappings = mapping
        .filter(mapping => mapping.javaVariableName !== 'territory')
        .map(mapping => {
            if (mapping.javaVariableName === 'planKeywords') {
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
        switch (type) {
            case GRID_EVENTS.READY: {
                setPrePlanColumnApi(columnApi);
                !columnApiState && setColumnApiState(columnApi);
                setPrePlanGridApi(api);
                setGridApi(api);
                columnApi?.applyColumnState({state: prePlanColumnDef, applyOrder: true});
                break;
            }
            case GRID_EVENTS.FIRST_DATA_RENDERED: {
                const selectedIds = persistedSelectedRights
                    .filter(x => allRights.map(x => x.id).includes(x.id))
                    .map(right => right.id);
                api.forEachNode?.(node => {
                    node?.setSelected(selectedIds.includes(node.data.id), false, true);
                });
                break;
            }
            case GRID_EVENTS.CELL_VALUE_CHANGED: {
                const data = [];
                api.forEachNode(node => {
                    data.push(node.data);
                });
                setAllRights(data);
                break;
            }
            case GRID_EVENTS.SELECTION_CHANGED:
                setSelectedPPRights(api.getSelectedRows());
                persistSelectedPPRights(api.getSelectedRows());
                break;
            case GRID_EVENTS.ROW_DATA_CHANGED:
                setPreplanRights({[username]: allRights});
                break;
            default:
                break;
        }
    };

    const reorderColumns = defs => {
        const columnDefs = [...defs];
        const newColumnDef = columnDefs.filter(u => !COLUMNS_TO_REORDER.includes(u.headerName));
        COLUMNS_TO_REORDER.forEach((colHeader, headerIndex) => {
            const index = columnDefs.findIndex(el => el.headerName === colHeader);
            if (index >= 0) {
                newColumnDef.splice(INSERT_FROM + headerIndex, 0, columnDefs[index]);
            }
        });
        return newColumnDef;
    };

    const storeSelectedRightsTabledApis = (api, cApi) => {
        setSelectedRightsGridApi(api);
        setSelectedRightsColumnApi(cApi);
    };

    const dragStoppedHandler = event => {
        const currentColumnDefs = gridApi.getColumnDefs();
        const updatedMappings = commonDragStoppedHandler(event, currentColumnDefs, mapping);
        setTableColumnDefinitions(updatedMappings);
        setPrePlanColumnDef(updatedMappings);
    };

    const toolbarActions = () => {
        return (
            <PrePlanActions
                selectedPrePlanRights={selectedPPRights}
                setSelectedPrePlanRights={setSelectedPPRights}
                setPreplanRights={setPreplanRights}
                prePlanRepoRights={allRights}
                username={username}
                singleRightMatch={singleRightMatch}
                setSingleRightMatch={setSingleRightMatch}
            />
        );
    };

    return count < allRights.length && !allRights.length ? (
        <Loading />
    ) : (
        <div className="pre-plan-rights-table-wrapper">
            <AvailsTableToolbar
                totalRecordsCount={allRights.length}
                activeTab={PRE_PLAN_TAB}
                selectedRowsCount={selectedPPRights.length}
                setIsSelected={setShowSelected}
                isSelected={showSelected}
                gridApi={showSelected ? selectedRightsGridApi : gridApi}
                columnApi={showSelected ? selectedRightsColumnApi : columnApiState}
                username={username}
                showSelectedButton={true}
                toolbarActions={toolbarActions()}
            />

            {!showSelected && (
                <PrePlanGrid
                    id="prePlanRightsRepo"
                    columnDefs={prePlanColumnDef.length ? prePlanColumnDef : tableColumnDefinitions}
                    singleClickEdit
                    context={{selectedRows: selectedPPRights}}
                    rowSelection="multiple"
                    suppressRowClickSelection={true}
                    mapping={[...editedMappings, planTerritoriesMapping, territoriesMapping, planKeywordsMapping]}
                    rowData={allRights}
                    onGridEvent={onGridReady}
                    dragStopped={dragStoppedHandler}
                    notFilterableColumns={['action', 'buttons']}
                />
            )}

            {showSelected && (
                <SelectedPreplanTable
                    columnDefs={prePlanColumnDef.length ? prePlanColumnDef : tableColumnDefinitions}
                    mapping={[...editedMappings, planTerritoriesMapping, territoriesMapping, planKeywordsMapping]}
                    selectedRights={selectedPPRights}
                    username={username}
                    setSelectedPrePlanRights={setSelectedPPRights}
                    storeGridApis={storeSelectedRightsTabledApis}
                />
            )}
        </div>
    );
};

PreplanRightsTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    setPreplanRights: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    setPrePlanColumnApi: PropTypes.func,
    setPrePlanGridApi: PropTypes.func,
    prePlanRights: PropTypes.object,
    persistSelectedPPRights: PropTypes.func.isRequired,
    persistedSelectedRights: PropTypes.array,
    setPrePlanColumnDef: PropTypes.func,
};

PreplanRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    setPrePlanColumnApi: () => null,
    setPrePlanGridApi: () => null,
    prePlanRights: {},
    persistedSelectedRights: [],
    setPrePlanColumnDef: () => null,
};

const mapStateToProps = () => {
    const preplanRightsSelector = selectors.createPreplanRightsSelector();
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        prePlanRights: preplanRightsSelector(state, props),
        username: getUsername(state),
    });
};

const mapDispatchToProps = dispatch => ({
    setPreplanRights: payload => dispatch(setPreplanRights(payload)),
    setPrePlanColumnDef: payload => dispatch(setPrePlanColumnDef(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreplanRightsTable);
