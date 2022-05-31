import React, {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import Error from '@atlaskit/icon/glyph/error';
import Warning from '@atlaskit/icon/glyph/warning';
import {getUsername} from '@portal/portal-auth/authSelectors';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {
    defineButtonColumn,
    defineCheckboxSelectionColumn,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {get, isEmpty, isEqual} from 'lodash';
import {connect, useDispatch, useSelector} from 'react-redux';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';
import usePrevious from '../../../util/hooks/usePrevious';
import useRowCountWithGridApiFix from '../../../util/hooks/useRowCountWithGridApiFix';
import {parseAdvancedFilterV2, rightsService} from '../../legacy/containers/avail/service/RightsService';
import {processOptions} from '../../legacy/containers/avail/util/ProcessSelectOptions';
import {TABLE_OPTIONS} from '../../title-metadata/constants';
import AvailsTableToolbar from '../avails-table-toolbar/AvailsTableToolbar';
import {
    deselectIngest,
    downloadEmailAttachment,
    downloadFileAttachment,
    fetchIngests,
    filterRightsByStatus,
    selectIngest,
} from '../ingest-panel/ingestActions';
import {getSelectedAttachmentId, getSelectedIngest, getTotalIngests} from '../ingest-panel/ingestSelectors';
import {getFiltersToSend} from '../ingest-panel/utils';
import {
    createAvailsMappingSelector,
    createRightMatchingColumnDefsSelector,
} from '../right-matching/rightMatchingSelectors';
import Ingest from '../rights-repository/components/ingest/Ingest';
import TooltipCellRenderer from '../rights-repository/components/tooltip/TooltipCellRenderer';
import {RIGHTS_TAB} from '../rights-repository/constants';
import {
    setColumnTableDefinition,
    setCurrentUserViewActionAvails,
    setPreplanRights,
    setRightsFilter,
    setSelectedRights,
} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import {
    createAvailsCurrentUserViewSelector,
    getLastUserColumnState,
    getSelectedRightsRepoColDefSelector,
} from '../rights-repository/rightsSelectors';
import {commonDragStoppedHandler, mapColumnDefinitions} from '../rights-repository/util/utils';
import SelectedRightsActions from '../selected-rights-actions/SelectedRightsActions';
import SelectedRightsTable from '../selected-rights-table/SelectedRightsTable';
import constants from '../constants';
import './RightsRepositoryTable.scss';

const RED_COLOR = '#FF8F73';
const YELLOW_COLOR = '#FFE380';

const RightsRepositoryTable = ({
    columnDefs,
    mapping,
    selectedIngest,
    setSelectedRights,
    selectedRights,
    setRightsFilter,
    rightsFilter,
    username,
    ingestClick,
    selectedAttachmentId,
    deselectIngest,
    isTableDataLoading,
    downloadIngestEmail,
    downloadIngestFile,
    filterByStatus,
    onFiltersChange,
    setRightsRepoGridApi,
    setRightsRepoColumnApi,
    setPreplanRights,
    prePlanRights,
    setCurrentUserView,
    totalIngests,
    toggleRefreshGridData,
    userView,
}) => {
    const dispatch = useDispatch();
    const previousGridState = useSelector(getLastUserColumnState(username));
    const selectedRightsRepoColDef = useSelector(getSelectedRightsRepoColDefSelector());

    const [showSelected, setShowSelected] = useState(false);
    const {count: totalCount, setCount: setTotalCount, api: gridApi, setApi: setGridApi} = useRowCountWithGridApiFix();
    const [updatedMapping, setUpdatedMapping] = useState(null);
    const [columnApiState, setColumnApiState] = useState(null);
    const previousExternalStatusFilter = usePrevious(get(rightsFilter, ['external', 'status']));
    const [singleRightMatch, setSingleRightMatch] = useState([]);
    const [attachment, setAttachment] = useState();
    const [selectedFilter, setSelectedFilter] = useState({});
    const [selectedRightsGridApi, setSelectedRightsGridApi] = useState(undefined);
    const [selectedRightsColumnApi, setSelectedRightsColumnApi] = useState(undefined);
    const [tableColumnDefinitions, setTableColumnDefinitions] = useState([]);

    const getCurrentUserSelRights = () => {
        const usersSelectedRights = Object.values(get(selectedRights, username, {}));
        if (!usersSelectedRights.length) {
            gridApi?.forEachNode?.(node => node.setSelected(false, true, true));
            gridApi?.redrawRows?.();
        }

        const {id} = selectedIngest || {};
        return id
            ? usersSelectedRights.filter(({availHistoryIds}) => !!availHistoryIds.find(avhId => avhId === id))
            : usersSelectedRights;
    };

    const getUserView = () => (isEmpty(userView) ? TABLE_OPTIONS[0] : userView);

    useEffect(() => {
        selectedRightsGridApi?.refreshCells();
    }, [selectedRights]);

    // Auto Refresh/Update of the Grid after Right has been ingested into the system
    useEffect(() => {
        toggleRefreshGridData(true);
    }, [totalIngests]);

    useEffect(() => {
        setTotalCount(0);
        ingestClick();
    }, [ingestClick]);

    useEffect(() => {
        if (selectedAttachmentId && gridApi) {
            setCurrentUserView(undefined);
            gridApi.setFilterModel(null);
        }
        setShowSelected(false);
    }, [selectedAttachmentId]);

    useEffect(() => {
        showSelected && setGridApi(undefined);
    }, [showSelected]);

    useEffect(() => {
        const updatedAttachment = selectedIngest?.attachments?.find(elem => elem.id === selectedAttachmentId);
        const timer = setInterval(() => {
            if (updatedAttachment?.status === 'PENDING' && attachment?.status === 'PENDING') {
                onFiltersChange(getFiltersToSend());
            } else {
                clearInterval(timer);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [selectedIngest, attachment]);

    useEffect(() => {
        if (selectedIngest && selectedAttachmentId) {
            const {attachments} = selectedIngest;
            const attachment = Array.isArray(attachments)
                ? attachments.find(a => a.id === selectedAttachmentId)
                : undefined;
            setAttachment(attachment);
            !attachment && deselectIngest();
        }
    }, [selectedIngest, selectedAttachmentId, deselectIngest]);

    useEffect(() => {
        const {external = {}} = rightsFilter || {};
        const {status} = external;
        if (!isEqual(previousExternalStatusFilter, status) && gridApi) {
            const filterInstance = gridApi.getFilterInstance('status');
            let values = [];
            if (!status || status === 'Rights') {
                const {options = []} =
                    (Array.isArray(mapping) && mapping.find(({javaVariableName}) => javaVariableName === 'status')) ||
                    {};
                values = options;
            } else {
                values = [rightsFilter.external.status];
            }

            filterInstance.setModel({type: 'set', values});
            gridApi.onFilterChanged();
        }
    }, [rightsFilter, mapping, previousExternalStatusFilter, gridApi]);

    const setHiddenFilters = () => {
        return mapping?.map(item => {
            const isHiddenFilters = item.displayName === 'Territory' || item.displayName === 'Selected';
            if (isHiddenFilters) return {...item, required: false, searchDataType: null};
            return item;
        });
    };

    const hiddenSelectedAndTerritoryFilters = useMemo(() => setHiddenFilters(), [mapping]);

    useEffect(() => {
        const viewID = getUserView()?.value;
        const newColumnState = previousGridState?.find(viewObj => viewID === viewObj.id)?.columnState;
        const columnIds = newColumnState?.map(item => item.colId);

        if (!tableColumnDefinitions.length) {
            const colDefs = constructColumnDefs(
                mapColumnDefinitions(
                    columnDefs.sort((a, b) => columnIds?.indexOf(a.colId) - columnIds?.indexOf(b.colId))
                )
            );
            const updatedColumnDefs = colDefs.length
                ? [
                      defineCheckboxSelectionColumn({
                          headerCheckboxSelection: true,
                          headerCheckboxSelectionFilteredOnly: true,
                      }),
                      actionMatchingButtonColumnDef,
                      ...colDefs,
                  ]
                : colDefs;

            setTableColumnDefinitions(updatedColumnDefs);
        }
    }, [columnDefs]);

    const constructColumnDefs = defs =>
        defs.map(col => {
            if (!['buttons', 'title', 'id', 'action', 'territoryDateSelected'].includes(col.field)) {
                return {
                    ...col,
                    cellStyle: params => cellStyling(params, col),
                    cellRendererFramework: params => {
                        const cellValue = params.valueFormatted || params.value;

                        if (
                            params.data != null &&
                            Object.keys(params.data).length > 0 &&
                            params.data?.validationErrors?.length > 0
                        ) {
                            const msg = [];
                            let severityType = '';
                            params.data.validationErrors.forEach(function (validation) {
                                const fieldName = validation.fieldName.split('[')[0];

                                if (col.field === fieldName) {
                                    msg.push(validation.message);

                                    if (
                                        severityType === '' ||
                                        (validation.severityType === 'Error' && severityType === 'Warning')
                                    ) {
                                        severityType = validation.severityType;
                                    }
                                }
                            });

                            if (severityType === 'Error' || severityType === 'Warning') {
                                return renderErrorWarning(cellValue, severityType, msg);
                            }
                        }

                        return <span>{cellValue}</span>;
                    },
                };
            }

            return {...col};
        });

    const renderErrorWarning = (cellValue, type, msg) => (
        <div>
            {cellValue}{' '}
            <span style={{float: 'right'}} title={msg.join(', ')}>
                {type === 'Error' ? <Error /> : <Warning />}
            </span>
        </div>
    );

    const actionMatchingButtonColumnDef = defineButtonColumn({
        cellRendererFramework: TooltipCellRenderer,
        cellRendererParams: {isTooltipEnabled: true, setSingleRightMatch},
        lockVisible: true,
        cellStyle: {overflow: 'visible'},
    });

    const cellStyling = ({data = {}, value, colDef}, column) => {
        const styling = {};

        if (Object.keys(data).length > 0 && data.validationErrors.length > 0 && colDef.colId !== 'icon') {
            let severityType = '';
            data?.validationErrors?.forEach(function (validation) {
                const fieldName = validation.fieldName.split('[')[0];
                if (column.field === fieldName && severityType !== 'Error') {
                    severityType = validation.severityType;
                }
            });

            if (severityType !== '') {
                styling.background = severityType === 'Error' ? RED_COLOR : YELLOW_COLOR;
            }
        }

        return styling;
    };

    const updateMapping = api => {
        const checkActiveFilter = filter => Boolean(api?.getFilterInstance(filter)?.isFilterActive());
        const resetFilters = filters => {
            filters.forEach(filterName => api.getFilterInstance(filterName)?.setModel(null));
        };

        const checkActiveFilters = {
            territoryDateSelected: checkActiveFilter('territoryDateSelected'),
            territory: checkActiveFilter('territoryCountry'),
            selected: checkActiveFilter('selected'),
        };

        if (checkActiveFilters.territoryDateSelected) {
            resetFilters(['territoryCountry', 'selected']);
            setUpdatedMapping(hiddenSelectedAndTerritoryFilters);
        } else if (checkActiveFilters.territory || checkActiveFilters.selected) {
            resetFilters(['territoryDateSelected']);
        } else {
            setUpdatedMapping(mapping);
        }

        api.refreshHeader();
    };

    const setGridApis = (api, columnApi) => {
        !gridApi && setGridApi(api);
        !gridApi && setRightsRepoGridApi(api);
        !columnApiState && setColumnApiState(columnApi);
        !columnApiState && setRightsRepoColumnApi(columnApi);
    };

    const onRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, SELECTION_CHANGED, FILTER_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;
        const currentViewColumnState =
            previousGridState?.find(d => d.id === getUserView()?.value)?.columnState || columnDefs;
        switch (type) {
            case READY:
                setGridApis(api, columnApi);
                api?.setFilterModel(rightsFilter?.column);
                columnApi?.applyColumnState({state: currentViewColumnState, applyOrder: true});
                break;
            case FIRST_DATA_RENDERED:
                updateMapping(api);
                break;
            case SELECTION_CHANGED: {
                setSelectedRights({[username]: api.getSelectedRows()});
                break;
            }
            case FILTER_CHANGED: {
                const filterModel = api.getFilterModel();

                if (Object.keys(filterModel || {}).length === 0) {
                    const filter = {...rightsFilter};
                    delete filter.column;
                    setRightsFilter(filter);
                    break;
                }

                const filters = {column: {...filterModel}, external: {...rightsFilter.external}};
                setRightsFilter(filters);
                updateMapping(api);
                break;
            }
            default:
                break;
        }
    };

    // add only new selected rights to pre-plan
    const addRightsToPrePlan = rights => {
        const currentUserPPRights = [...(prePlanRights?.[username] || [])];
        const prePlanIds = currentUserPPRights.map(right => right.id);
        const newSelectedRights = rights.filter(right => !prePlanIds.includes(right.id));
        setPreplanRights({
            [username]: [...(currentUserPPRights || []), ...newSelectedRights],
        });
    };

    const onReloadData = () => {
        if (showSelected) {
            rightsService
                .advancedSearchV2([], 0, 100, [{sort: 'desc', colId: 'updatedAt'}], {isLocal: false})
                .then(res => onDataFetched(res));
        }
    };

    const toolbarActions = () => (
        <SelectedRightsActions
            selectedRights={getCurrentUserSelRights()}
            selectedRightGridApi={showSelected ? selectedRightsGridApi : gridApi}
            setSelectedRights={setSelectedRights}
            setPrePlanRepoRights={addRightsToPrePlan}
            singleRightMatch={singleRightMatch}
            setSingleRightMatch={setSingleRightMatch}
            onReloadData={onReloadData}
        />
    );

    const storeSelectedRightsTabledApis = (api, cApi) => {
        setSelectedRightsGridApi(api);
        setSelectedRightsColumnApi(cApi);
    };
    const setSelectedRightsToolbar = payload => {
        setSelectedRights({[username]: payload});
    };

    const onDataFetched = res => {
        const {data} = res;
        const selectedIds = getCurrentUserSelRights().map(x => x.id);
        const refreshedSelectedRights = data.filter(x => selectedIds.includes(x.id));
        if (refreshedSelectedRights.length) {
            setSelectedRights({[username]: refreshedSelectedRights});
        }
    };

    const dragStoppedHandler = event => {
        const currentColumnDefs = gridApi.getColumnDefs();
        const updatedMappings = commonDragStoppedHandler(event, currentColumnDefs, mapping);
        setTableColumnDefinitions(updatedMappings);
        saveColumnTableDef(event);
    };

    const saveColumnTableDef = event => {
        const newColumnState = event.columnApi?.getColumnState();
        const viewID = getUserView()?.value;

        const finalState = previousGridState?.map(viewObj => {
            if (viewID === viewObj.id) {
                Object.assign(viewObj, {...viewObj, columnState: newColumnState});
            }
            return viewObj;
        });

        dispatch(setColumnTableDefinition({[username]: finalState}));
    };

    return (
        <div className="rights-table-wrapper">
            {!isEmpty(selectedIngest) && attachment && !showSelected && (
                <Ingest
                    ingest={selectedIngest}
                    deselectIngest={deselectIngest}
                    downloadIngestEmail={downloadIngestEmail}
                    downloadIngestFile={downloadIngestFile}
                    attachment={attachment}
                    filterByStatus={filterByStatus}
                />
            )}

            <AvailsTableToolbar
                activeTab={RIGHTS_TAB}
                totalRecordsCount={totalCount}
                selectedRowsCount={getCurrentUserSelRights().length}
                setIsSelected={setShowSelected}
                isSelected={showSelected}
                setSelectedRights={setSelectedRightsToolbar}
                gridApi={showSelected ? selectedRightsGridApi : gridApi}
                rightsFilter={rightsFilter}
                columnApi={showSelected ? selectedRightsColumnApi : columnApiState}
                username={username}
                singleRightMatch={singleRightMatch}
                setSingleRightMatch={setSingleRightMatch}
                showSelectedButton={true}
                toolbarActions={toolbarActions()}
            />

            {!showSelected && (
                <RightsRepoComposedTable
                    id="rightsRepo"
                    columnDefs={tableColumnDefinitions}
                    rowSelection="multiple"
                    suppressRowClickSelection={true}
                    singleClickEdit
                    context={{selectedRows: getCurrentUserSelRights()}}
                    mapping={updatedMapping || mapping}
                    setTotalCount={setTotalCount}
                    onGridEvent={onRightsRepositoryGridEvent}
                    dragStopped={dragStoppedHandler}
                    initialFilter={rightsFilter.column}
                    params={rightsFilter.external}
                    multiSortKey="ctrl"
                    setData={onDataFetched}
                    setDataLoading={() => null}
                    rowClassRules={{
                        'nexus-c-rights-repository__row': params =>
                            params &&
                            params.data &&
                            params.data.status &&
                            (params.data.status === 'Merged' || params.data.status === 'Deleted'),
                    }}
                />
            )}

            {showSelected && (
                <SelectedRightsTable
                    columnDefs={selectedRightsRepoColDef.length ? selectedRightsRepoColDef : tableColumnDefinitions}
                    mapping={mapping}
                    notFilterableColumns={['action', 'buttons']}
                    selectedFilter={selectedFilter}
                    selectedIngest={selectedIngest}
                    setSelectedFilter={setSelectedFilter}
                    selectedRights={getCurrentUserSelRights()}
                    username={username}
                    storeGridApi={storeSelectedRightsTabledApis}
                    setTableColumnDefinitions={setTableColumnDefinitions}
                    saveColumnTableDef={saveColumnTableDef}
                />
            )}
        </div>
    );
};

RightsRepositoryTable.propTypes = {
    columnDefs: PropTypes.array.isRequired,
    setSelectedRights: PropTypes.func.isRequired,
    setRightsFilter: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    mapping: PropTypes.array,
    selectedIngest: PropTypes.object,
    selectedRights: PropTypes.object,
    rightsFilter: PropTypes.object,
    ingestClick: PropTypes.func.isRequired,
    selectedAttachmentId: PropTypes.string,
    deselectIngest: PropTypes.func.isRequired,
    isTableDataLoading: PropTypes.bool,
    downloadIngestEmail: PropTypes.func.isRequired,
    downloadIngestFile: PropTypes.func.isRequired,
    filterByStatus: PropTypes.func.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
    setRightsRepoGridApi: PropTypes.func.isRequired,
    setRightsRepoColumnApi: PropTypes.func.isRequired,
    setPreplanRights: PropTypes.func.isRequired,
    prePlanRights: PropTypes.object,
    setCurrentUserView: PropTypes.func.isRequired,
    totalIngests: PropTypes.number,
    toggleRefreshGridData: PropTypes.func,
    userView: PropTypes.object,
};

RightsRepositoryTable.defaultProps = {
    mapping: [],
    selectedIngest: {},
    selectedRights: {},
    rightsFilter: {},
    selectedAttachmentId: '',
    isTableDataLoading: false,
    prePlanRights: {},
    totalIngests: 0,
    toggleRefreshGridData: () => null,
    userView: {},
};

const mapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();
    const availsMappingSelector = createAvailsMappingSelector();
    const selectedRightsSelector = selectors.createSelectedRightsSelector();
    const rightsFilterSelector = selectors.createRightsFilterSelector();
    const fromSelectedTableSelector = selectors.createFromSelectedTableSelector();
    const preplanRightsSelector = selectors.createPreplanRightsSelector();
    const currentUserViewSelector = createAvailsCurrentUserViewSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        selectedIngest: getSelectedIngest(state),
        selectedRights: selectedRightsSelector(state, props),
        rightsFilter: rightsFilterSelector(state, props),
        username: getUsername(state),
        selectedAttachmentId: getSelectedAttachmentId(state),
        fromSelectedTable: fromSelectedTableSelector(state, props),
        prePlanRights: preplanRightsSelector(state, props),
        currentUserView: currentUserViewSelector(state),
        totalIngests: getTotalIngests(state),
        userView: currentUserViewSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    setSelectedRights: payload => dispatch(setSelectedRights(payload)),
    setRightsFilter: payload => dispatch(setRightsFilter(payload)),
    ingestClick: () => dispatch(selectIngest()),
    deselectIngest: () => dispatch(deselectIngest()),
    downloadIngestEmail: payload => dispatch(downloadEmailAttachment(payload)),
    downloadIngestFile: payload => dispatch(downloadFileAttachment(payload)),
    filterByStatus: payload => dispatch(filterRightsByStatus(payload)),
    onFiltersChange: payload => dispatch(fetchIngests(payload)),
    setPreplanRights: payload => dispatch(setPreplanRights(payload)),
    setCurrentUserView: payload => dispatch(setCurrentUserViewActionAvails(payload)),
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepositoryTable);

const RightsRepoComposedTable = compose(
    withSideBar(),
    withFilterableColumns({prepareFilterParams: parseAdvancedFilterV2, filtersMapping: processOptions}),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: rightsService.advancedSearchV2, filtersInBody: true}),
    withSorting(constants.INITIAL_SORT)
)(NexusGrid);
