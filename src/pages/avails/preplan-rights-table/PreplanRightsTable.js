import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import Loading from '../../static/Loading';
import AvailsTableToolbar from '../avails-table-toolbar/AvailsTableToolbar';
import {PrePlanActions} from '../pre-plan-actions/PrePlanActions';
import {setPreplanRights} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
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
    const [columnApi, setColumnApi] = useState(undefined);
    const [selectedPPRights, setSelectedPPRights] = useState([]);
    const [showSelected, setShowSelected] = useState(false);
    const [allRights, setAllRights] = useState([]);
    const [singleRightMatch, setSingleRightMatch] = useState([]);
    const firstDataRendered = useRef(false);
    useEffect(() => {
        setCount(0);
        updateRightDetails();
    }, []);

    useEffect(() => {
        setSelectedPPRights([...persistedSelectedRights]);
    }, [allRights]);

    // useEffect(() => {
    //     if (selectedPPRights.length && gridApi) {
    //         const selectedIds = selectedPPRights.map(right => right.id);
    //         gridApi.forEachNode?.(node => {
    //             console.log(node.data.id);
    //             console.log(selectedIds.includes(node.data.id));
    //             node?.setSelected(selectedIds.includes(node.data.id), false, true);
    //         });
    //         gridApi.refreshCells();
    //     }
    // }, [selectedPPRights, gridApi]);

    const updateRightDetails = () => {
        const currentUserPPRights = prePlanRights[username];

        let updatedPrePlanRepo = [...currentUserPPRights];
        currentUserPPRights.forEach(right =>
            rightsService
                .get(right.id, {isWithErrorHandling: true})
                .then(result => {
                    setCount(prevCount => prevCount + 1);
                    const oldRecord = currentUserPPRights.find(p => p.id === right.id);
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
                        planKeywords: oldRecord.planKeywords,
                        territory: updatedTerritories.filter(t => (!t.selected && !t.isDirty) || t.isDirty),
                        territorySelected: result.territory.filter(item => item.selected).map(t => t.country),
                        territoryAll: result.territory.map(item => item.country).join(', '),
                    };
                    const prePlanRight = updatedPrePlanRepo.filter(p => p.id !== right.id);
                    updatedPrePlanRepo = [...prePlanRight, updatedResult];
                    // setPreplanRights({[username]: updatedPrePlanRepo});
                    setAllRights([...updatedPrePlanRepo]);
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
                firstDataRendered.current = false;
                setPrePlanColumnApi(columnApi);
                setColumnApi(columnApi);
                setPrePlanGridApi(api);
                setGridApi(api);
                api.deselectAll();
                break;
            }
            case GRID_EVENTS.FIRST_DATA_RENDERED: {
                firstDataRendered.current = true;
                const selectedIds = selectedPPRights.map(right => right.id);
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
                if (firstDataRendered.current) {
                    setSelectedPPRights(api.getSelectedRows());
                    persistSelectedPPRights(api.getSelectedRows());
                }
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

    return count < selectedPPRights.length ? (
        <Loading />
    ) : (
        <div className="pre-plan-rights-table-wrapper">
            <AvailsTableToolbar
                allRowsCount={allRights.length}
                selectedRowsCount={selectedPPRights.length}
                setIsSelected={setShowSelected}
                isSelected={showSelected}
                selectedRows={selectedPPRights}
                // setSelectedRights={setSelectedRightsToolbar}
                gridApi={gridApi}
                // rightsFilter={rightsFilter}
                rightColumnApi={columnApi}
                username={username}
                // singleRightMatch={singleRightMatch}
                // setSingleRightMatch={setSingleRightMatch}
                showSelectedButton={true}
                toolbarActions={toolbarActions()}
            />

            {!showSelected && (
                <PrePlanGrid
                    id="prePlanRightsRepo"
                    columnDefs={reorderColumns([
                        ...filteredColumnDefs,
                        planTerritoriesColumn,
                        territoriesColumn,
                        planKeywordsColumn,
                    ])}
                    singleClickEdit
                    rowSelection="multiple"
                    suppressRowClickSelection={true}
                    mapping={[...editedMappings, planTerritoriesMapping, territoriesMapping, planKeywordsMapping]}
                    rowData={allRights}
                    context={{selectedRows: [...allRights]}}
                    onGridEvent={onGridReady}
                    notFilterableColumns={['action', 'buttons']}
                />
            )}

            {showSelected && (
                <SelectedPreplanTable
                    columnDefs={columnDefs}
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
    return (state, props) => ({
        prePlanRights: preplanRightsSelector(state, props),
        username: getUsername(state),
    });
};

const mapDispatchToProps = dispatch => ({
    setPreplanRights: payload => dispatch(setPreplanRights(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreplanRightsTable);
