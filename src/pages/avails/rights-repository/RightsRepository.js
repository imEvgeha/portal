import React, {useEffect, useState, useRef} from 'react';
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
import {isEmpty, isEqual, get, isObject, debounce} from 'lodash';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';
import usePrevious from '../../../util/hooks/usePrevious';
import {parseAdvancedFilterV2, rightsService} from '../../legacy/containers/avail/service/RightsService';
import AvailsTableToolbar from '../avails-table-toolbar/AvailsTableToolbar';
import {
    deselectIngest,
    downloadEmailAttachment,
    downloadFileAttachment,
    filterRightsByStatus,
    selectIngest,
} from '../ingest-panel/ingestActions';
import {getSelectedAttachmentId, getSelectedIngest} from '../ingest-panel/ingestSelectors';
import PreplanRightsTable from '../preplan-rights-table/PreplanRightsTable';
import {createRightMatchingColumnDefs} from '../right-matching/rightMatchingActions';
import {
    createAvailsMappingSelector,
    createRightMatchingColumnDefsSelector,
} from '../right-matching/rightMatchingSelectors';
import DOPService from '../selected-for-planning/DOP-services';
import SelectedForPlanning from '../selected-for-planning/SelectedForPlanning';
import RightsRepositoryHeader from './components/RightsRepositoryHeader/RightsRepositoryHeader';
import Ingest from './components/ingest/Ingest';
import TooltipCellRenderer from './components/tooltip/TooltipCellRenderer';
import {setRightsFilter, setSelectedRights, setPreplanRights} from './rightsActions';
import * as selectors from './rightsSelectors';
import {RIGHTS_TAB, RIGHTS_SELECTED_TAB, SELECTED_FOR_PLANNING_TAB} from './constants';
import constants from '../constants';
import './RightsRepository.scss';

const RightsRepositoryTable = compose(
    withSideBar(),
    withFilterableColumns({prepareFilterParams: parseAdvancedFilterV2}),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: rightsService.advancedSearchV2, filtersInBody: true}),
    withSorting(constants.INITIAL_SORT)
)(NexusGrid);

const SelectedRightsRepositoryTable = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withSorting()
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
}) => {
    const isMounted = useRef(true);
    const [totalCount, setTotalCount] = useState(0);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [selectedColumnApi, setSelectedColumnApi] = useState(null);
    const [prePlanGridApi, setPrePlanGridApi] = useState();
    const [prePlanColumnApi, setPrePlanColumnApi] = useState(null);
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);
    const [selectedGridApi, setSelectedGridApi] = useState(null);
    const [selectedForPlanningGridApi, setSelectedForPlanningGridApi] = useState(null);
    const [selectedForPlanningColumnApi, setSelectedForPlanningColumnApi] = useState(null);
    const [selectedRepoRights, setSelectedRepoRights] = useState([]);
    const previousExternalStatusFilter = usePrevious(get(rightsFilter, ['external', 'status']));
    const [attachment, setAttachment] = useState();
    const {search} = location;
    const [selectedFilter, setSelectedFilter] = useState({});
    const [planningRightsCount, setPlanningRightsCount] = useState(0);
    const [selectedPrePlanRights, setSelectedPrePlanRights] = useState([]);
    const [isPlanningTabRefreshed, setIsPlanningTabRefreshed] = useState(false);
    const [currentUserPrePlanRights, setCurrentUserPrePlanRights] = useState([]);
    const [currentUserSelectedRights, setCurrentUserSelectedRights] = useState([]);
    const [singleRightMatch, setSingleRightMatch] = useState([]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        gridApi && gridApi.setFilterModel(null);
    }, [selectedIngest, selectedAttachmentId, gridApi]);

    // TODO: create column defs on app loading
    useEffect(() => {
        // TODO: refactor this - unnecessary call
        if (!columnDefs.length || !mapping) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, mapping, createRightMatchingColumnDefs]);

    useEffect(() => {
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

            // Filter selected rights only when ingest is selected
            if (selectedIngest) {
                gridApi.getSelectedRows().forEach(row => {
                    if (selectedIds?.includes(row.id)) {
                        loadedSelectedRights.push(row);
                    }
                });
                newSelectedRepoRights = loadedSelectedRights;
            }
            
            gridApi.forEachNode(node => {
                const {data = {}} = node;
                if(selectedIds.includes(data.id)) 
                    node.setSelected(true);
                else
                data.id && node.setSelected(false);
            });
        }
        if (isMounted.current) {
            setSelectedRepoRights(getSelectedRightsFromIngest(newSelectedRepoRights, selectedIngest));
        }
    }, [search, currentUserSelectedRights, selectedIngest, gridApi, isTableDataLoading]);

    useEffect(() => {
        if (isMounted.current && selectedGridApi) {
            if (isTableDataLoading) {
                selectedGridApi.clearFocusedCell();
                selectedGridApi.showLoadingOverlay();
            } else {
                selectedGridApi.hideOverlay();
            }
        }
    }, [isTableDataLoading, selectedGridApi]);

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
            selectedGridApi.selectAll();
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
        if (isMounted.current && isObject(prePlanRights) && username) {
            setCurrentUserPrePlanRights(prePlanRights[username] || []);
        }
    }, [prePlanRights, username]);

    // Fetch only selected rights from the current user
    useEffect(() => {
        if (isMounted.current && isObject(selectedRights) && username) {
            const usersSelectedRights = get(selectedRights, username, {});
            setCurrentUserSelectedRights(Object.values(usersSelectedRights));
        }
    }, [Object.values(get(selectedRights, username, {})).length, username]);

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
        if (!['buttons', 'title', 'id', 'action'].includes(col.field)) {
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

    const onRightsRepositoryGridEvent = debounce(({type, api, columnApi}) => {
        const {READY, SELECTION_CHANGED, FILTER_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY:
                setGridApi(api);
                setColumnApi(columnApi);
                break;
            case SELECTION_CHANGED: {
                let clonedSelectedRights = currentUserSelectedRights;
                
                // Get selected rows from both tables
                const rightsTableSelectedRows = api?.getSelectedRows() || [];
                const selectedTableSelectedRows = selectedGridApi?.getSelectedRows() || [];

                // Extract IDs of selected rights in main table
                const allSelectedRowsIds = rightsTableSelectedRows.map(({id}) => id);

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
                    !Object.keys(selectedIngest).length &&
                    rightsTableSelectedRows.length !== selectedTableSelectedRows.length &&
                    clonedSelectedRights.length > rightsTableSelectedRows.length
                ) {
                    // Filter out the selected rights whose rows are not selected. Basically finding the row
                    // that was just deselected.
                    const updatedSelectedRights = clonedSelectedRights.filter(right =>
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
                else if(!Object.keys(selectedIngest).length && selectedTableSelectedRows.length !== rightsTableSelectedRows.length) {                    
                    setSelectedRights({[username]: rightsTableSelectedRows});
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
                        clonedSelectedRights = [...currentUserSelectedRights, data];
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
                setRightsFilter({...rightsFilter, column});
                break;
            }
            default:
                break;
        }
    }, 500);
    // add only new selected rights to pre-plan
    const addRightsToPrePlan = rights => {
        const prePlanIds = currentUserPrePlanRights.map(right => right.id);
        const newSelectedRights = rights.filter(right => !prePlanIds.includes(right.id));
        setPreplanRights({[username]: [...(currentUserPrePlanRights || []), ...newSelectedRights]});
    };

    const onSelectedRightsRepositoryGridEvent = debounce(({type, api, columnApi}) => {
        const {READY, ROW_DATA_CHANGED, SELECTION_CHANGED, FILTER_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY:
                setSelectedGridApi(api);
                setSelectedColumnApi(columnApi);
                break;
            case SELECTION_CHANGED: {
                // Get IDs from all selected rights from selectedRights ag-grid table
                const allSelectedRowsIds = api?.getSelectedRows()?.map(({id}) => id);
                // Get ID of a right to be deselected
                const toDeselectIds = selectedRepoRights
                    .map(({id}) => id)
                    .filter(selectedRepoId => !allSelectedRowsIds.includes(selectedRepoId));

                // Get all selected nodes from main ag-grid table and filter only ones to deselect
                const nodesToDeselect = gridApi
                    ?.getSelectedNodes()
                    ?.filter(({data = {}}) => toDeselectIds.includes(data.id));

                // If row was unselected but it was not found via gridApi, then manually deselect it and
                // update the store. Otherwise proceed with normal flow via gridApi and update the store via
                // onRightsRepositoryGridEvent handler
                
                    if (api.getSelectedRows()?.length < selectedRepoRights.length) {
                        setSelectedRights({[username]: selectedRepoRights.filter(({id}) => !toDeselectIds.includes(id))});
                    } else {
                        nodesToDeselect?.forEach(node => node?.setSelected(false));
                    }
                
                break;
            }
            case ROW_DATA_CHANGED:
                api.setFilterModel(selectedFilter);
                break;
            case FILTER_CHANGED:
                setSelectedFilter(api.getFilterModel());
                break;
            default:
                break;
        }
    },500);

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
            <RightsRepositoryHeader gridApi={gridApi} columnApi={columnApi} username={username} activeTab={activeTab} />
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
            <AvailsTableToolbar
                totalRows={totalCount}
                selectedRightsCount={selectedRepoRights.length}
                prePlanRightsCount={currentUserPrePlanRights.length}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
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
            />
            <RightsRepositoryTable
                id="rightsRepo"
                columnDefs={updatedColumnDefs}
                rowSelection="multiple"
                suppressRowClickSelection={true}
                singleClickEdit
                context={{selectedRows: currentUserSelectedRights}}
                mapping={mapping}
                setTotalCount={setTotalCount}
                onGridEvent={(type) => onRightsRepositoryGridEvent(type, gridApi, columnApi)}
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
            <SelectedRightsRepositoryTable
                id="selectedRightsRepo"
                columnDefs={updatedColumnDefsCheckBoxHeader}
                singleClickEdit
                rowSelection="multiple"
                suppressRowClickSelection={true}
                mapping={mapping}
                rowData={selectedRepoRights}
                isGridHidden={activeTab !== RIGHTS_SELECTED_TAB}
                onGridEvent={onSelectedRightsRepositoryGridEvent}
                notFilterableColumns={['action', 'buttons']}
            />
            <PreplanRightsTable
                columnDefs={updatedColumnDefsCheckBoxHeader}
                prePlanRepoRights={currentUserPrePlanRights}
                activeTab={activeTab}
                mapping={mapping}
                setPreplanRights={setPreplanRights}
                setPrePlanColumnApi={setPrePlanColumnApi}
                setPrePlanGridApi={setPrePlanGridApi}
                setSelectedPrePlanRights={setSelectedPrePlanRights}
                username={username}
            />
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
};

const mapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();
    const availsMappingSelector = createAvailsMappingSelector();
    const selectedRightsSelector = selectors.createSelectedRightsSelector();
    const preplanRightsSelector = selectors.createPreplanRightsSelector();
    const rightsFilterSelector = selectors.createRightsFilterSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        selectedIngest: getSelectedIngest(state),
        selectedAttachmentId: getSelectedAttachmentId(state),
        selectedRights: selectedRightsSelector(state, props),
        prePlanRights: preplanRightsSelector(state, props),
        rightsFilter: rightsFilterSelector(state, props),
        username: getUsername(state),
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
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepository);
