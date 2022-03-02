/* eslint-disable no-unused-expressions, no-magic-numbers */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Error from '@atlaskit/icon/glyph/error';
import Warning from '@atlaskit/icon/glyph/warning';
import * as colors from '@atlaskit/theme/colors';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
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
import {filterBy} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/utils';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
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
import PreplanRightsTable from '../preplan-rights-table/PreplanRightsTable';
import {createRightMatchingColumnDefs} from '../right-matching/rightMatchingActions';
import {
    createAvailsMappingSelector,
    createRightMatchingColumnDefsSelector,
} from '../right-matching/rightMatchingSelectors';
import DOPService from '../selected-for-planning/DOP-services';
import SelectedForPlanning from '../selected-for-planning/SelectedForPlanning';
import SelectedPreplanTable from '../selected-preplan-table/SelectedPreplanTable';
import SelectedRightsTable from '../selected-rights-table/SelectedRightsTable';
import StatusLogRightsTable from '../status-log-rights-table/StatusLogRightsTable';
import RightsRepositoryHeader from './components/RightsRepositoryHeader/RightsRepositoryHeader';
import Ingest from './components/ingest/Ingest';
import TooltipCellRenderer from './components/tooltip/TooltipCellRenderer';
import {setPreplanRights, setRightsFilter, setSelectedRights} from './rightsActions';
import * as selectors from './rightsSelectors';
import {PRE_PLAN_TAB, RIGHTS_TAB, SELECTED_FOR_PLANNING_TAB, STATUS_TAB} from './constants';
import constants from '../constants';
import './RightsRepository.scss';

const RightsRepositoryTable = compose(
    withSideBar(),
    withFilterableColumns({prepareFilterParams: parseAdvancedFilterV2, filtersMapping: processOptions}),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: rightsService.advancedSearchV2, filtersInBody: true}),
    withSorting(constants.INITIAL_SORT)
)(NexusGrid);

const RightsRepository = ({
    columnDefs,
    createRightMatchingColumnDefs,
    mapping,
    selectedIngest,
    selectedAttachmentId,
    filterByStatus,
    ingestClick,
    setSelectedRights,
    setPreplanRights,
    selectedRights,
    prePlanRights,
    setRightsFilter,
    rightsFilter,
    deselectIngest,
    downloadIngestEmail,
    downloadIngestFile,
    location,
    isTableDataLoading,
    setIsTableDataLoading,
    username,
    onFiltersChange,
    statusLogCount,
    fromSelectedTable,
}) => {
    const isMounted = useRef(true);
    const [updatedMapping, setUpdatedMapping] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [selectedColumnApi, setSelectedColumnApi] = useState(null);
    const [prePlanGridApi, setPrePlanGridApi] = useState();
    const [prePlanColumnApi, setPrePlanColumnApi] = useState(null);
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [isSelected, setIsSelected] = useState(false);

    const [selectedGridApi, setSelectedGridApi] = useState(null);
    const [selectedForPlanningGridApi, setSelectedForPlanningGridApi] = useState(null);
    const [selectedForPlanningColumnApi, setSelectedForPlanningColumnApi] = useState(null);
    const [selectedRepoRights, setSelectedRepoRights] = useState([]);

    const [attachment, setAttachment] = useState();
    const {search} = location;

    const [selectedFilter, setSelectedFilter] = useState({});
    const [planningRightsCount, setPlanningRightsCount] = useState(0);
    const [selectedPrePlanRights, setSelectedPrePlanRights] = useState([]);
    const [isPlanningTabRefreshed, setIsPlanningTabRefreshed] = useState(false);

    const [currentUserPrePlanRights, setCurrentUserPrePlanRights] = useState([]);
    const [currentUserSelectedRights, setCurrentUserSelectedRights] = useState([]);

    const [singleRightMatch, setSingleRightMatch] = useState([]);
    const previousExternalStatusFilter = usePrevious(get(rightsFilter, ['external', 'status']));
    const {count: totalCount, setCount: setTotalCount, api: gridApi, setApi: setGridApi} = useRowCountWithGridApiFix();

    const repositoryFilterModel = useRef(undefined);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        // deselect the selected ingest when the user changes tab
        deselectIngest();
    }, [activeTab]);

    useEffect(() => {
        const updatedAttachment = selectedIngest?.attachments?.find(elem => elem.id === selectedAttachmentId);
        const timer = setInterval(() => {
            if (updatedAttachment?.status === 'PENDING' && attachment?.status === 'PENDING')
                onFiltersChange(getFiltersToSend());
            else clearInterval(timer);
        }, 3000);

        return () => clearInterval(timer);
    }, [selectedIngest, attachment]);

    // update periodically the list of ingests
    useEffect(() => {
        const timer = setInterval(() => {
            onFiltersChange(getFiltersToSend());
        }, 50000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        gridApi && gridApi.setFilterModel(null);
    }, [selectedAttachmentId, gridApi]);

    // TODO: create column defs on app loading
    useEffect(() => {
        // TODO: refactor this - unnecessary call
        if (!columnDefs.length || !mapping) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, mapping, createRightMatchingColumnDefs]);

    useEffect(() => {
        setTotalCount(0);
        ingestClick();
    }, [ingestClick]);

    useEffect(() => {
        if (isMounted.current && selectedIngest && selectedAttachmentId) {
            const {attachments} = selectedIngest;
            const attachment = Array.isArray(attachments)
                ? attachments.find(a => a.id === selectedAttachmentId)
                : undefined;
            setAttachment(attachment);
            if (!attachment) {
                deselectIngest();
            }
        }
    }, [selectedIngest, selectedAttachmentId, deselectIngest]);

    useEffect(() => {
        const {external = {}} = rightsFilter || {};
        const {status} = external;
        if (isMounted.current && !isEqual(previousExternalStatusFilter, status) && gridApi) {
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

            filterInstance.setModel({
                type: 'set',
                values,
            });
            gridApi.onFilterChanged();
        }
    }, [rightsFilter, mapping, previousExternalStatusFilter, gridApi]);

    useEffect(() => {
        let newSelectedRepoRights = currentUserSelectedRights;

        if (isMounted.current && gridApi) {
            const selectedIds = currentUserSelectedRights?.map(({id}) => id);
            const loadedSelectedRights = [];

            //     // Filter selected rights only when ingest is selected
            if (selectedIngest) {
                gridApi.getSelectedRows()?.forEach(row => {
                    if (selectedIds?.includes(row.id)) {
                        loadedSelectedRights.push(row);
                    }
                });
                newSelectedRepoRights = loadedSelectedRights;
            }

            // Added if statement to prevent state late updates when SelectedTable is used,
            // Counter switched to use currentUserSelectedRights istead selectedRepoRight
            if (activeTab === RIGHTS_TAB) {
                gridApi.forEachNode(node => {
                    const {data = {}} = node;

                    selectedIds.includes(data.id) ? node.setSelected(true) : node.setSelected(false);
                });
            }
        }
        if (isMounted.current) {
            setSelectedRepoRights(getSelectedRightsFromIngest(newSelectedRepoRights, selectedIngest));
        }
    }, [search, currentUserSelectedRights, selectedIngest, gridApi, isTableDataLoading]);

    useEffect(() => {
        if (isMounted.current && selectedGridApi && selectedRepoRights.length > 0) {
            const updatedPrePlanRights = [...currentUserPrePlanRights];
            selectedRepoRights?.forEach(selectedRight => {
                const index = currentUserPrePlanRights?.findIndex(right => right.id === selectedRight.id);
                if (index >= 0) {
                    updatedPrePlanRights[index] = {
                        ...currentUserPrePlanRights[index],
                        coreTitleId: selectedRight.coreTitleId,
                    };
                }
            });
            updatedPrePlanRights.length && setPreplanRights({[username]: updatedPrePlanRights});
        }
    }, [selectedRepoRights, selectedGridApi]);

    // Fetch and set DOP projects count for current user
    useEffect(() => {
        DOPService.getUsersProjectsList(1, 1)
            .then(([response, headers]) => {
                const total = parseInt(headers.get('X-Total-Count') || response.length);
                if (isMounted.current) {
                    setPlanningRightsCount(total);
                }
            })
            .catch(error => {
                // error-handling here
            });
    }, [activeTab, get(prePlanRights, `[${username}].length`, 0), isPlanningTabRefreshed]);

    // Fetch only pre-plan rights from the current user
    useEffect(() => {
        if (isMounted.current && !isEmpty(prePlanRights) && username) {
            setCurrentUserPrePlanRights(prePlanRights[username] || []);
        }
    }, [prePlanRights, username]);

    // Fetch only selected rights from the current user
    useEffect(() => {
        if (isMounted.current && !isEmpty(selectedRights) && username) {
            const usersSelectedRights = get(selectedRights, username, {});
            setCurrentUserSelectedRights(Object.values(usersSelectedRights));
        }
    }, [JSON.stringify(selectedRights), username]);

    // Update with state from SelectedRightsTable
    useEffect(() => {
        if (isMounted.current && !isEmpty(fromSelectedTable) && username) {
            const usersSelectedRights = get(fromSelectedTable, username, {});
            setCurrentUserSelectedRights(Object.values(usersSelectedRights));
        }
    }, [fromSelectedTable]);

    const columnDefsClone = columnDefs.map(columnDef => {
        const updatedColumnDef = {
            ...columnDef,
            menuTabs: ['generalMenuTab'],
            sortable: !['Withdrawn', 'Selected'].includes(columnDef.headerName),
        };

        if (columnDef.colId === 'displayName') {
            updatedColumnDef.cellRendererFramework = params => {
                const {valueFormatted} = params || {};
                const value = valueFormatted ? ' '.concat(valueFormatted.split(';').join('\n')) : '';
                return (
                    <div className="nexus-c-rights-repo-table__cast-crew">
                        <NexusTooltip content={value}>
                            <div>{valueFormatted || ''}</div>
                        </NexusTooltip>
                    </div>
                );
            };
        }
        return updatedColumnDef;
    });

    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn();
    const actionMatchingButtonColumnDef = defineButtonColumn({
        cellRendererFramework: TooltipCellRenderer,
        cellRendererParams: {isTooltipEnabled: true, setSingleRightMatch},
        lockVisible: true,
        cellStyle: {overflow: 'visible'},
    });

    const columnsValidationDefsClone = columnDefsClone.map(col => {
        const mappingCol = mapping.find(elem => elem.queryParamName === col.field);
        if (['icon'].includes(col.colId)) {
            // eslint-disable-next-line no-param-reassign
            if (['updatedCatalogReceived'].includes(col.field)) {
                return {
                    ...col,
                    sortable: false,
                    width: 175,
                };
            }

            if (['rightStatus'].includes(col.field)) {
                return {
                    ...col,
                    sortable: false,
                    width: 150,
                };
            }

            return {
                ...col,
                sortable: false,
            };
        }

        if (mappingCol?.dataType === 'multiselect') {
            return {
                ...col,
                cellRenderer: 'wordsCellRenderer',
            };
        }

        if (!['buttons', 'title', 'id', 'action', 'territoryDateSelected'].includes(col.field)) {
            return {
                ...col,
                cellStyle: params => cellStyling(params, col),
                cellRendererFramework: params => {
                    const cellValue = params.valueFormatted ? params.valueFormatted : params.value;

                    if (
                        params.data != null &&
                        Object.keys(params.data).length > 0 &&
                        params.data.validationErrors.length > 0
                    ) {
                        const msg = [];
                        let severityType = '';
                        params.data.validationErrors.forEach(function (validation) {
                            const fieldName = validation.fieldName.includes('[')
                                ? validation.fieldName.split('[')[0]
                                : validation.fieldName;

                            if (col.field === fieldName) {
                                msg.push(validation.message);

                                if (
                                    severityType === '' ||
                                    (validation.severityType === 'Error' && severityType === 'Warning')
                                ) {
                                    // eslint-disable-next-line prefer-destructuring
                                    severityType = validation.severityType;
                                }
                            }
                        });

                        if (severityType === 'Error') {
                            return (
                                <div>
                                    {cellValue}{' '}
                                    <span style={{float: 'right'}} title={msg.join(', ')}>
                                        <Error />
                                    </span>
                                </div>
                            );
                        } else if (severityType === 'Warning') {
                            return (
                                <div>
                                    {cellValue}{' '}
                                    <span style={{float: 'right'}} title={msg.join(', ')}>
                                        <Warning />
                                    </span>
                                </div>
                            );
                        }
                    }

                    return <span>{cellValue}</span>;
                },
            };
        }

        if (['territoryDateSelected'].includes(col.field)) {
            return {
                ...col,
                cellRenderer: 'selectedAtCellRenderer',
            };
        }

        return {
            ...col,
        };
    });

    const cellStyling = ({data = {}, value, colDef}, column) => {
        const styling = {};

        if (Object.keys(data).length > 0 && data.validationErrors.length > 0 && colDef.colId !== 'icon') {
            let severityType = '';
            data.validationErrors.forEach(function (validation) {
                const fieldName = validation.fieldName.includes('[')
                    ? validation.fieldName.split('[')[0]
                    : validation.fieldName;
                if (column.field === fieldName && severityType !== 'Error') {
                    // eslint-disable-next-line prefer-destructuring
                    severityType = validation.severityType;
                }
            });

            if (severityType !== '') {
                styling.background = severityType === 'Error' ? colors.R100 : colors.Y100;
            }
        }

        return styling;
    };

    const updatedColumnDefs = columnsValidationDefsClone.length
        ? [checkboxSelectionColumnDef, actionMatchingButtonColumnDef, ...columnsValidationDefsClone]
        : columnsValidationDefsClone;

    const checkboxSelectionWithHeaderColumnDef = defineCheckboxSelectionColumn({
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
    });

    const updatedColumnDefsCheckBoxHeader = columnDefsClone.length
        ? [checkboxSelectionWithHeaderColumnDef, actionMatchingButtonColumnDef, ...columnDefsClone]
        : columnDefsClone;

    const selectedAtCol = updatedColumnDefsCheckBoxHeader.find(item => item.headerName === 'Selected At');
    const selectedCol = updatedColumnDefsCheckBoxHeader.find(item => item.headerName === 'Selected');
    if (selectedAtCol && selectedCol) {
        selectedAtCol.valueFormatter = selectedCol.valueFormatter;
    }

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

    const updateMapping = api => {
        const checkActiveFilter = filter => Boolean(api?.getFilterInstance(filter)?.isFilterActive());
        const resetFilters = filters => {
            filters.forEach(filterName => {
                const filterInstance = api.getFilterInstance(filterName);
                filterInstance.setModel(null);
            });
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

    const onRightsRepositoryGridEvent = ({type, api, columnApi: gridColumnApi}) => {
        const {READY, SELECTION_CHANGED, FILTER_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;

        switch (type) {
            case FIRST_DATA_RENDERED:
                setGridApi(api);
                updateMapping(api);
                setColumnApi(gridColumnApi);
                break;
            case READY:
                setGridApi(api);
                setColumnApi(gridColumnApi);
                if (repositoryFilterModel.current) {
                    api.setFilterModel(repositoryFilterModel.current);
                }
                break;
            case SELECTION_CHANGED: {
                if (activeTab === RIGHTS_TAB) {
                    let clonedSelectedRights = currentUserSelectedRights;

                    // Get selected rows from both tables
                    const rightsTableSelectedRows = currentUserSelectedRights;
                    const selectedTableSelectedRows = api?.getSelectedRows() || [];

                    // Extract IDs of selected rights in main table
                    const allSelectedRowsIds = rightsTableSelectedRows?.map(({id}) => id);

                    const idsToRemove = [];

                    // This was added to prevent having to double click on rights from ingests when viewing
                    // all selected rights. It's a dirty fix to check if there is a difference between selected Rights
                    // and selected rows in ag-grid. If there are less in the table, then find the difference and remove it.
                    //
                    // N.B. This happens only when showing all selected rights.
                    //      Checking if both tables have equal amount of selected rows is necessary because when page
                    //      is freshly loaded and we have selected rights from the store, while they appear in the table
                    //      and appear selected, they are not selected from the main table's perspective, so this would
                    //      cause loss of data without the check, as rights from ingest would have been removed.
                    if (
                        !selectedIngest &&
                        rightsTableSelectedRows.length === selectedTableSelectedRows.length &&
                        clonedSelectedRights.length > rightsTableSelectedRows.length
                    ) {
                        // Filter out the selected rights whose rows are not selected. Basically finding the row
                        // that was just deselected.
                        const updatedSelectedRights = clonedSelectedRights?.filter(right =>
                            allSelectedRowsIds.includes(right.id)
                        );

                        // Pack the new selected rights into a payload for the store update; converts array of objects
                        // to object of objects where the keys are object(right) ids.
                        const payload = updatedSelectedRights.reduce((selectedRights, currentRight) => {
                            selectedRights[currentRight.id] = currentRight;
                            return selectedRights;
                        }, {});
                        setSelectedRights({[username]: payload});
                        break;
                    }

                    // Select/deselect process
                    api.forEachNode(node => {
                        const {data = {}} = node;

                        const wasSelected = clonedSelectedRights.find(right => right.id === data.id) !== undefined;

                        // If it was selected and currently is not, then add it to the list of values to be deselected
                        // otherwise add it to selected rights
                        if (wasSelected && !node.isSelected()) {
                            idsToRemove.push(data.id);
                        } else if (!wasSelected && node.isSelected()) {
                            clonedSelectedRights = [...currentUserSelectedRights, ...clonedSelectedRights, data];
                        }
                    });

                    // Filter out rights that were deselected
                    const updatedSelectedRights = clonedSelectedRights.filter(right => !idsToRemove.includes(right.id));

                    // Pack the new selected rights into a payload for the store update; converts array of objects
                    // to object of objects where the keys are object(right) ids.
                    const payload = updatedSelectedRights.reduce((selectedRights, currentRight) => {
                        selectedRights[currentRight.id] = currentRight;
                        return selectedRights;
                    }, {});
                    setSelectedRights({[username]: payload});
                }

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

                // setRightsFilter({...rightsFilter, column});
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
        const prePlanIds = currentUserPrePlanRights.map(right => right.id);
        const newSelectedRights = rights.filter(right => !prePlanIds.includes(right.id));
        setPreplanRights({
            [username]: [...(currentUserPrePlanRights || []), ...newSelectedRights],
        });
    };

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

    return (
        <div className="nexus-c-rights-repository">
            <RightsRepositoryHeader
                gridApi={gridApi}
                columnApi={columnApi}
                username={username}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeTabIndex={activeTabIndex}
                setActiveTabIndex={setActiveTabIndex}
            />
            <AvailsTableToolbar
                totalRows={totalCount === 'One' ? 1 : totalCount}
                selectedRightsCount={currentUserSelectedRights.length}
                prePlanRightsCount={currentUserPrePlanRights.length}
                setIsSelected={setIsSelected}
                isSelected={isSelected}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                activeTabIndex={activeTabIndex}
                setActiveTabIndex={setActiveTabIndex}
                selectedRows={currentUserSelectedRights}
                setSelectedRights={payload => setSelectedRights({[username]: payload})}
                gridApi={gridApi}
                rightsFilter={rightsFilter}
                rightColumnApi={columnApi}
                selectedRightColumnApi={selectedColumnApi}
                selectedRightGridApi={selectedGridApi}
                selectedRepoRights={selectedRepoRights}
                setPrePlanRepoRights={addRightsToPrePlan}
                planningRightsCount={planningRightsCount}
                selectedPrePlanRights={selectedPrePlanRights}
                setSelectedPrePlanRights={setSelectedPrePlanRights}
                prePlanRepoRights={currentUserPrePlanRights}
                setPreplanRights={setPreplanRights}
                isPlanningTabRefreshed={isPlanningTabRefreshed}
                setIsPlanningTabRefreshed={setIsPlanningTabRefreshed}
                username={username}
                singleRightMatch={singleRightMatch}
                setSingleRightMatch={setSingleRightMatch}
                prePlanColumnApi={prePlanColumnApi}
                prePlanGridApi={prePlanGridApi}
                selectedForPlanningColumnApi={selectedForPlanningColumnApi}
                selectedForPlanningGridApi={selectedForPlanningGridApi}
                statusRightsCount={statusLogCount}
            />
            {!isEmpty(selectedIngest) && attachment && (
                <Ingest
                    ingest={selectedIngest}
                    deselectIngest={deselectIngest}
                    downloadIngestEmail={downloadIngestEmail}
                    downloadIngestFile={downloadIngestFile}
                    attachment={attachment}
                    filterByStatus={filterByStatus}
                />
            )}
            {activeTab === RIGHTS_TAB && !isSelected && (
                <RightsRepositoryTable
                    id="rightsRepo"
                    columnDefs={updatedColumnDefs}
                    rowSelection="multiple"
                    suppressRowClickSelection={true}
                    singleClickEdit
                    context={{selectedRows: currentUserSelectedRights}}
                    mapping={updatedMapping || mapping}
                    setTotalCount={setTotalCount}
                    onGridEvent={type => onRightsRepositoryGridEvent(type, gridApi, columnApi)}
                    isGridHidden={activeTab !== RIGHTS_TAB}
                    initialFilter={rightsFilter.column}
                    params={rightsFilter.external}
                    multiSortKey="ctrl"
                    setDataLoading={setIsTableDataLoading}
                    rowClassRules={{
                        'nexus-c-rights-repository__row': params =>
                            params &&
                            params.data &&
                            params.data.status &&
                            (params.data.status === 'Merged' || params.data.status === 'Deleted'),
                    }}
                />
            )}

            {activeTab === RIGHTS_TAB && isSelected && (
                <SelectedRightsTable
                    columnDefs={updatedColumnDefsCheckBoxHeader}
                    mapping={mapping}
                    rowData={selectedRepoRights}
                    notFilterableColumns={['action', 'buttons']}
                    activeTab={activeTab}
                    selectedColumnApi={selectedColumnApi}
                    setSelectedColumnApi={setSelectedColumnApi}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    selectedRepoRights={selectedRepoRights}
                    gridApi={gridApi}
                    selectedRights={selectedRights}
                    username={username}
                    selectedGridApi={selectedGridApi}
                    setSelectedGridApi={setSelectedGridApi}
                />
            )}
            <PreplanRightsTable
                columnDefs={updatedColumnDefsCheckBoxHeader}
                prePlanRepoRights={currentUserPrePlanRights}
                context={{selectedRows: selectedPrePlanRights}}
                activeTab={activeTab}
                mapping={mapping}
                setPreplanRights={setPreplanRights}
                setPrePlanColumnApi={setPrePlanColumnApi}
                setPrePlanGridApi={setPrePlanGridApi}
                setSelectedPrePlanRights={setSelectedPrePlanRights}
                username={username}
            />
            {activeTab === PRE_PLAN_TAB && isSelected && (
                <SelectedPreplanTable
                    columnDefs={updatedColumnDefsCheckBoxHeader}
                    mapping={mapping}
                    rowData={selectedPrePlanRights}
                    activeTab={activeTab}
                    selectedColumnApi={selectedColumnApi}
                    setSelectedColumnApi={setSelectedColumnApi}
                    selectedRepoRights={selectedPrePlanRights}
                    gridApi={gridApi}
                    selectedRights={selectedPrePlanRights}
                    username={username}
                    selectedGridApi={selectedGridApi}
                    setSelectedGridApi={setSelectedGridApi}
                />
            )}
            {activeTab === STATUS_TAB && <StatusLogRightsTable activeTab={activeTab} />}
            {activeTab === SELECTED_FOR_PLANNING_TAB && (
                <SelectedForPlanning
                    activeTab={activeTab}
                    isPlanningTabRefreshed={isPlanningTabRefreshed}
                    setSelectedForPlanningGridApi={setSelectedForPlanningGridApi}
                    setSelectedForPlanningColumnApi={setSelectedForPlanningColumnApi}
                />
            )}
        </div>
    );
};

RightsRepository.propTypes = {
    columnDefs: PropTypes.array.isRequired,
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    filterByStatus: PropTypes.func.isRequired,
    ingestClick: PropTypes.func.isRequired,
    setSelectedRights: PropTypes.func.isRequired,
    setPreplanRights: PropTypes.func.isRequired,
    setRightsFilter: PropTypes.func.isRequired,
    downloadIngestEmail: PropTypes.func.isRequired,
    downloadIngestFile: PropTypes.func.isRequired,
    deselectIngest: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    mapping: PropTypes.array,
    selectedIngest: PropTypes.object,
    selectedAttachmentId: PropTypes.string,
    selectedRights: PropTypes.object,
    prePlanRights: PropTypes.object,
    rightsFilter: PropTypes.object,
    isTableDataLoading: PropTypes.bool,
    setIsTableDataLoading: PropTypes.func,
    onFiltersChange: PropTypes.func,
    fromSelectedTable: PropTypes.object,
    statusLogCount: PropTypes.number,
};

RightsRepository.defaultProps = {
    mapping: [],
    selectedIngest: {},
    selectedAttachmentId: '',
    selectedRights: {},
    prePlanRights: {},
    rightsFilter: {},
    isTableDataLoading: false,
    setIsTableDataLoading: () => null,
    onFiltersChange: () => null,
    fromSelectedTable: {},
    statusLogCount: 0,
};

const mapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();
    const availsMappingSelector = createAvailsMappingSelector();
    const selectedRightsSelector = selectors.createSelectedRightsSelector();
    const preplanRightsSelector = selectors.createPreplanRightsSelector();
    const rightsFilterSelector = selectors.createRightsFilterSelector();
    const fromSelectedTableSelector = selectors.createFromSelectedTableSelector();
    const statusLogCountSelector = selectors.createStatusLogCountSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        selectedIngest: getSelectedIngest(state),
        selectedAttachmentId: getSelectedAttachmentId(state),
        selectedRights: selectedRightsSelector(state, props),
        prePlanRights: preplanRightsSelector(state, props),
        rightsFilter: rightsFilterSelector(state, props),
        username: getUsername(state),
        fromSelectedTable: fromSelectedTableSelector(state, props),
        statusLogCount: statusLogCountSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    filterByStatus: payload => dispatch(filterRightsByStatus(payload)),
    ingestClick: () => dispatch(selectIngest()),
    setSelectedRights: payload => dispatch(setSelectedRights(payload)),
    setPreplanRights: payload => dispatch(setPreplanRights(payload)),
    deselectIngest: () => dispatch(deselectIngest()),
    downloadIngestEmail: payload => dispatch(downloadEmailAttachment(payload)),
    downloadIngestFile: payload => dispatch(downloadFileAttachment(payload)),
    setRightsFilter: payload => dispatch(setRightsFilter(payload)),
    onFiltersChange: payload => dispatch(fetchIngests(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepository);
