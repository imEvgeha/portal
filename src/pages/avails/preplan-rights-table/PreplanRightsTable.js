import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {
    defineButtonColumn,
    defineCheckboxSelectionColumn,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import Loading from '../../static/Loading';
import AvailsTableToolbar from '../avails-table-toolbar/AvailsTableToolbar';
import PrePlanActions from '../pre-plan-actions/PrePlanActions';
import {createRightMatchingColumnDefsSelector} from '../right-matching/rightMatchingSelectors';
import TooltipCellRenderer from '../rights-repository/components/tooltip/TooltipCellRenderer';
import {PRE_PLAN_TAB} from '../rights-repository/constants';
import {setPreplanRights} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import {mapColumnDefinitions} from '../rights-repository/util/utils';
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

const PrePlanGrid = compose(withColumnsResizing(), withSideBar(), withEditableColumns())(NexusGrid);

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
}) => {
    const [count, setCount] = useState(0);
    const [gridApi, setGridApi] = useState(undefined);
    const [columnApiState, setColumnApiState] = useState(undefined);
    const [selectedPPRights, setSelectedPPRights] = useState([]);
    const [showSelected, setShowSelected] = useState(false);
    const [allRights, setAllRights] = useState([]);
    const [singleRightMatch, setSingleRightMatch] = useState([]);
    const [tableColumnDefinitions, setTableColumnDefinitions] = useState([]);
    const [selectedTableColDefs, setSelectedTableColDefs] = useState([]);

    useEffect(() => {
        if (!tableColumnDefinitions.length) {
            // column defs
            const actionMatchingButtonColumnDef = defineButtonColumn({
                cellRendererFramework: TooltipCellRenderer,
                cellRendererParams: {isTooltipEnabled: true, setSingleRightMatch},
                lockVisible: true,
                cellStyle: {overflow: 'visible'},
            });

            const checkboxSelectionWithHeaderColumnDef = defineCheckboxSelectionColumn({
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
            });

            const columnDefsClone = mapColumnDefinitions(columnDefs);

            const updatedColumnDefsCheckBoxHeader = columnDefsClone.length
                ? [checkboxSelectionWithHeaderColumnDef, actionMatchingButtonColumnDef, ...columnDefsClone]
                : columnDefsClone;

            const selectedAtCol = updatedColumnDefsCheckBoxHeader.find(item => item.headerName === 'Selected At');
            const selectedCol = updatedColumnDefsCheckBoxHeader.find(item => item.headerName === 'Selected');
            if (selectedAtCol && selectedCol) {
                selectedAtCol.valueFormatter = selectedCol.valueFormatter;
            }

            setSelectedTableColDefs([...updatedColumnDefsCheckBoxHeader]);

            const filteredColumnDefs = updatedColumnDefsCheckBoxHeader.filter(
                columnDef => columnDef.colId !== 'territoryCountry'
            );

            setTableColumnDefinitions(filteredColumnDefs);
        }
    }, [columnDefs]);

    useEffect(() => {
        initRights();
    }, [prePlanRights]);

    useEffect(() => {
        const allRightsIds = allRights.map(x => x.id);
        setSelectedPPRights([...persistedSelectedRights.filter(x => allRightsIds.includes(x.id))]);
    }, [allRights]);

    const initRights = () => {
        setCount(0);
        updateRightDetails();
    };

    const updateRightDetails = () => {
        const currentUserPPRights = prePlanRights[username];
        const rightAPIs = currentUserPPRights.map(right => rightsService.get(right.id, {isWithErrorHandling: true}));

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
        const result = [];
        switch (type) {
            case GRID_EVENTS.READY: {
                setPrePlanColumnApi(columnApi);
                !columnApiState && setColumnApiState(columnApi);
                setPrePlanGridApi(api);
                setGridApi(api);
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
            case GRID_EVENTS.CELL_VALUE_CHANGED:
                api.forEachNode(({data = {}}) => {
                    const {territory, planKeywords} = data || {};
                    let value = data;
                    if (territory || planKeywords) {
                        value = {...data, territory, planKeywords};
                    }
                    result.push(value);
                });
                setPreplanRights({[username]: result});
                break;
            case GRID_EVENTS.SELECTION_CHANGED:
                setSelectedPPRights(api.getSelectedRows());
                persistSelectedPPRights(api.getSelectedRows());
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
                gridApi={gridApi}
                columnApi={columnApiState}
                username={username}
                showSelectedButton={true}
                toolbarActions={toolbarActions()}
            />

            {!showSelected && (
                <PrePlanGrid
                    id="prePlanRightsRepo"
                    columnDefs={reorderColumns([
                        ...tableColumnDefinitions,
                        planTerritoriesColumn,
                        territoriesColumn,
                        planKeywordsColumn,
                    ])}
                    singleClickEdit
                    rowSelection="multiple"
                    suppressRowClickSelection={true}
                    mapping={[...editedMappings, planTerritoriesMapping, territoriesMapping, planKeywordsMapping]}
                    rowData={allRights}
                    onGridEvent={onGridReady}
                    notFilterableColumns={['action', 'buttons']}
                />
            )}

            {showSelected && (
                <SelectedPreplanTable
                    columnDefs={selectedTableColDefs}
                    mapping={mapping}
                    selectedRights={selectedPPRights}
                    username={username}
                    setSelectedPrePlanRights={setSelectedPPRights}
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
};

PreplanRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    setPrePlanColumnApi: () => null,
    setPrePlanGridApi: () => null,
    prePlanRights: {},
    persistedSelectedRights: [],
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PreplanRightsTable);
