import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Error from '@atlaskit/icon/glyph/error';
import Warning from '@atlaskit/icon/glyph/warning';
import * as colors from '@atlaskit/theme/colors';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import {defineButtonColumn} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {filterBy} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/utils';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/src/elements/nexus-grid/constants';
import {defineCheckboxSelectionColumn} from '@vubiquity-nexus/portal-ui/src/elements/nexus-grid/elements/columnDefinitions';
import {get, isEmpty, isEqual} from 'lodash';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';
import usePrevious from '../../../util/hooks/usePrevious';
import useRowCountWithGridApiFix from '../../../util/hooks/useRowCountWithGridApiFix';
import {parseAdvancedFilterV2, rightsService} from '../../legacy/containers/avail/service/RightsService';
import {processOptions} from '../../legacy/containers/avail/util/ProcessSelectOptions';
import AvailsTableToolbar from '../avails-table-toolbar/AvailsTableToolbar';
import {
    deselectIngest,
    downloadEmailAttachment,
    downloadFileAttachment,
    fetchIngests,
    filterRightsByStatus,
    selectIngest,
} from '../ingest-panel/ingestActions';
import {getSelectedAttachmentId, getSelectedIngest} from '../ingest-panel/ingestSelectors';
import {getFiltersToSend} from '../ingest-panel/utils';
import {
    createAvailsMappingSelector,
    createRightMatchingColumnDefsSelector,
} from '../right-matching/rightMatchingSelectors';
import Ingest from '../rights-repository/components/ingest/Ingest';
import TooltipCellRenderer from '../rights-repository/components/tooltip/TooltipCellRenderer';
import {RIGHTS_TAB} from '../rights-repository/constants';
import {setPreplanRights, setRightsFilter, setSelectedRights} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import {mapColumnDefinitions} from '../rights-repository/util/utils';
import SelectedRightsActions from '../selected-rights-actions/SelectedRightsActions';
import SelectedRightsTable from '../selected-rights-table/SelectedRightsTable';
import constants from '../constants';
import './RightsRepositoryTable.scss';

const RightsRepositoryTable = ({
    columnDefs,
    mapping,
    selectedIngest,
    setSelectedRights,
    selectedRights,
    setRightsFilter,
    rightsFilter,
    username,
    location,
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
}) => {
    const {search} = location;

    const [showSelected, setShowSelected] = useState(false);
    const {count: totalCount, setCount: setTotalCount, api: gridApi, setApi: setGridApi} = useRowCountWithGridApiFix();
    const [updatedMapping, setUpdatedMapping] = useState(null);
    const [columnApiState, setColumnApiState] = useState(null);
    const previousExternalStatusFilter = usePrevious(get(rightsFilter, ['external', 'status']));
    const [singleRightMatch, setSingleRightMatch] = useState([]);
    const [attachment, setAttachment] = useState();
    const repositoryFilterModel = useRef(undefined);
    const [selectedFilter, setSelectedFilter] = useState({});
    const [selectedRightsGridApi, setSelectedRightsGridApi] = useState(undefined);
    const [tableColumnDefinitions, setTableColumnDefinitions] = useState([]);

    const getCurrentUserSelRights = () => {
        const usersSelectedRights = Object.values(get(selectedRights, username, {}));
        if (!usersSelectedRights.length) {
            gridApi?.forEachNode?.(node => node.setSelected(false, true, true));
            gridApi?.redrawRows?.();
        }
        return usersSelectedRights;
    };

    useEffect(() => {
        setTotalCount(0);
        ingestClick();
    }, [ingestClick]);

    useEffect(() => {
        gridApi && gridApi.setFilterModel(null);
    }, [selectedAttachmentId, gridApi]);

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

    // Update with state from SelectedRightsTable
    // useEffect(() => {
    //     if (!isEmpty(fromSelectedTable) && username) {
    //         const usersSelectedRights = get(fromSelectedTable, username, {});
    //         setCurrentUserSelectedRights(Object.values(usersSelectedRights));
    //     }
    // }, [fromSelectedTable]);

    useEffect(() => {
        // let newSelectedRepoRights = currentUserSelectedRights;
        // if (gridApi) {
        //     const selectedIds = currentUserSelectedRights?.map(({id}) => id);
        //     const loadedSelectedRights = [];
        //
        //     //     // Filter selected rights only when ingest is selected
        //     if (selectedIngest) {
        //         gridApi?.getSelectedRows()?.forEach(row => {
        //             if (selectedIds?.includes(row.id)) {
        //                 loadedSelectedRights.push(row);
        //             }
        //         });
        //         newSelectedRepoRights = loadedSelectedRights;
        //     }
        //
        //     // Added if statement to prevent state late updates when SelectedTable is used,
        //     // Counter switched to use currentUserSelectedRights istead selectedRepoRight
        //     gridApi?.forEachNode?.(node => {
        //         const {data = {}} = node;
        //
        //         if (node.id) {
        //             selectedIds.includes(data.id)
        //                 ? node.setSelected(true, false, true)
        //                 : node.setSelected(false, false, true);
        //         }
        //     });
        // }
        // setSelectedRepoRights(getSelectedRightsFromIngest(newSelectedRepoRights, selectedIngest));
        // setCurrentUserSelectedRights(getSelectedRightsFromIngest(newSelectedRepoRights, selectedIngest));
    }, [search, selectedRights, selectedIngest, gridApi, isTableDataLoading]);

    // Returns only selected rights that are also included in the selected ingest
    const getSelectedRightsFromIngest = (selectedRights, selectedIngest = {}) => {
        const {id} = selectedIngest || {};
        // If an ingest is selected, provide only selected rights that also belong to the ingest.
        // Otherwise return all selected rights.
        return id
            ? selectedRights.filter(({availHistoryIds}) => {
                  return !!availHistoryIds.find(avhId => avhId === id);
              })
            : selectedRights;
    };

    const setHiddenFilters = isSelectedAt => {
        return mapping?.map(item => {
            const isHiddenFilters = isSelectedAt
                ? item.displayName === 'Territory' || item.displayName === 'Selected'
                : item.displayName === 'Selected At';
            if (isHiddenFilters) return {...item, required: false, searchDataType: null};
            return item;
        });
    };

    const hiddenSelectedAndTerritoryFilters = useMemo(() => setHiddenFilters(true), [mapping]);
    const hiddenSelectedAtFilter = useMemo(() => setHiddenFilters(false), [mapping]);

    useEffect(() => {
        if (!tableColumnDefinitions.length) {
            const colDefs = constructColumnDefs(mapColumnDefinitions(columnDefs));
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
                styling.background = severityType === 'Error' ? colors.R100 : colors.Y100;
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
            setUpdatedMapping(hiddenSelectedAtFilter);
        } else {
            setUpdatedMapping(mapping);
        }

        api.refreshHeader();
    };

    const setGridApis = (api, columnApi) => {
        !gridApi && setGridApi(api);
        !gridApi && setRightsRepoGridApi(api);
        !columnApiState && setColumnApiState(columnApi);
        !columnApi && setRightsRepoColumnApi(columnApi);
    };

    const onRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, SELECTION_CHANGED, FILTER_CHANGED, FIRST_DATA_RENDERED, ROW_DATA_CHANGED, GRID_SIZE_CHANGED} =
            GRID_EVENTS;

        switch (type) {
            case READY:
                setGridApis(api, columnApi);
                if (repositoryFilterModel.current) {
                    api?.setFilterModel(repositoryFilterModel.current);
                }
                break;
            case FIRST_DATA_RENDERED:
                updateMapping(api);
                break;
            case SELECTION_CHANGED: {
                setSelectedRights({[username]: api.getSelectedRows()});
                break;
            }
            case FILTER_CHANGED: {
                const column = filterBy(api.getFilterModel());

                if (Object.keys(column || {}).length === 0) {
                    const filter = {...rightsFilter};
                    delete filter.column;
                    setRightsFilter(filter);
                    break;
                }

                repositoryFilterModel.current = api.getFilterModel();
                const filters = {column: {...rightsFilter.column, ...column}, external: {...rightsFilter.external}};
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

    const toolbarActions = () => (
        <SelectedRightsActions
            selectedRights={getCurrentUserSelRights()}
            selectedRightGridApi={selectedRightsGridApi}
            setSelectedRights={setSelectedRights}
            setPrePlanRepoRights={addRightsToPrePlan}
            singleRightMatch={singleRightMatch}
            setSingleRightMatch={setSingleRightMatch}
        />
    );

    const storeSelectedRightsGridApi = api => setSelectedRightsGridApi(api);
    const setSelectedRightsToolbar = payload => {
        setSelectedRights({[username]: payload});
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
                gridApi={gridApi}
                rightsFilter={rightsFilter}
                columnApi={columnApiState}
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
                    initialFilter={rightsFilter.column}
                    params={rightsFilter.external}
                    multiSortKey="ctrl"
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
                    columnDefs={tableColumnDefinitions}
                    mapping={mapping}
                    notFilterableColumns={['action', 'buttons']}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    selectedRights={getCurrentUserSelRights()}
                    username={username}
                    storeGridApi={storeSelectedRightsGridApi}
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
    location: PropTypes.object.isRequired,
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
};

RightsRepositoryTable.defaultProps = {
    mapping: [],
    selectedIngest: {},
    selectedRights: {},
    rightsFilter: {},
    selectedAttachmentId: '',
    isTableDataLoading: false,
    prePlanRights: {},
};

const mapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();
    const availsMappingSelector = createAvailsMappingSelector();
    const selectedRightsSelector = selectors.createSelectedRightsSelector();
    const rightsFilterSelector = selectors.createRightsFilterSelector();
    const fromSelectedTableSelector = selectors.createFromSelectedTableSelector();
    const preplanRightsSelector = selectors.createPreplanRightsSelector();

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
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepositoryTable);

const RightsRepoComposedTable = compose(
    withSideBar(),
    withFilterableColumns({prepareFilterParams: parseAdvancedFilterV2, filtersMapping: processOptions}),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: rightsService.advancedSearchV2, filtersInBody: true}),
    withSorting(constants.INITIAL_SORT)
)(NexusGrid);
