import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {cloneDeep, isEmpty, isEqual} from 'lodash';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import './RightsRepository.scss';
import {parseAdvancedFilterV2, rightsService} from '../../legacy/containers/avail/service/RightsService';
import * as selectors from './rightsSelectors';
import {setRightsFilter, setSelectedRights} from './rightsActions';
import {
    createAvailsMappingSelector,
    createRightMatchingColumnDefsSelector
} from '../right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../right-matching/rightMatchingActions';
import Ingest from './components/ingest/Ingest';
import {
    deselectIngest,
    downloadEmailAttachment,
    downloadFileAttachment,
    filterRightsByStatus,
    selectIngest
} from '../ingest-panel/ingestActions';
import {getSelectedAttachmentId, getSelectedIngest} from '../ingest-panel/ingestSelectors';
import RightsRepositoryHeader from './components/RightsRepositoryHeader/RightsRepositoryHeader';
import {GRID_EVENTS} from '../../../ui/elements/nexus-grid/constants';
import {
    defineButtonColumn,
    defineCheckboxSelectionColumn
} from '../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withFilterableColumns from '../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import withInfiniteScrolling from '../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withSorting from '../../../ui/elements/nexus-grid/hoc/withSorting';
import {NexusGrid, NexusTableToolbar} from '../../../ui/elements';
import {filterBy} from '../../../ui/elements/nexus-grid/utils';
import CustomActionsCellRenderer
    from '../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import usePrevious from '../../../util/hooks/usePrevious';
import {calculateIndicatorType, INDICATOR_RED} from './util/indicator';
import TooltipCellEditor from './components/tooltip/TooltipCellEditor';

export const RIGHTS_TAB = 'RIGHTS_TAB';
export const RIGHTS_SELECTED_TAB = 'RIGHTS_SELECTED_TAB';

const RightsRepositoryTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withFilterableColumns({prepareFilterParams: parseAdvancedFilterV2}),
    withInfiniteScrolling({fetchData: rightsService.advancedSearchV2}),
    withSorting(constants.INITIAL_SORT),
)(NexusGrid);

const SelectedRightsRepositoryTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withFilterableColumns(),
    withSorting(),
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
    selectedRights,
    setRightsFilter,
    rightsFilter,
    deselectIngest,
    downloadIngestEmail,
    downloadIngestFile,
    location,
}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [gridApi, setGridApi] = useState();
    const [columnApi, setColumnApi] = useState();
    const [selectedColumnApi, setSelectedColumnApi] = useState();
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);
    const [selectedGridApi, setSelectedGridApi] = useState();
    const [selectedRepoRights, setSelectedRepoRights] = useState([]);
    const previousExternalStatusFilter = usePrevious(rightsFilter && rightsFilter.external && rightsFilter.external.status);
    const [attachment, setAttachment] = useState();
    const [isRepositoryDataLoading, setIsRepositoryDataLoading] = useState(false);
    const {search} = location;
    const previousActiveTab = usePrevious(activeTab);
    const [selectedFilter, setSelectedFilter] = useState({});

    useEffect(() => {
        gridApi && gridApi.setFilterModel(null);
    }, [selectedIngest, selectedAttachmentId]);

    // TODO: create column defs on app loading
    useEffect(() => {
        // TODO: refactor this - unnecessary call
        if (!columnDefs.length || !mapping) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, mapping, createRightMatchingColumnDefs]);

    useEffect(() => {
        ingestClick();
    }, []);

    useEffect(() => {
        if (selectedIngest && selectedAttachmentId) {
            const {attachments} = selectedIngest;
            const attachment = attachments.find(a => a.id === selectedAttachmentId);
            setAttachment(attachment);
            if (!attachment) {
                deselectIngest();
            }
        }
    }, [selectedIngest, selectedAttachmentId]);

    useEffect(() => {
        const {external = {}} = rightsFilter || {};
        const {status} = external;
        if (!isEqual(previousExternalStatusFilter, status) && gridApi) {
            const filterInstance = gridApi.getFilterInstance('status');
            let values;
            if (!status || status === 'Rights') {
                const {options = []} = (Array.isArray(mapping)
                    && mapping.find(({javaVariableName}) => javaVariableName === 'status')
                ) || {};
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
    }, [rightsFilter, mapping]);

    useEffect(() => {
        let newSelectedRepoRights = cloneDeep(selectedRights);

        if (gridApi) {
            const selectedIds = newSelectedRepoRights.map(({id}) => id);
            const loadedSelectedRights = [];

            // Filter selected rights only when ingest is selected
            if (selectedIngest) {
                gridApi.getSelectedRows().forEach((row) => {
                    if (selectedIds.includes(row.id)){
                        loadedSelectedRights.push(row);
                    }
                });
                newSelectedRepoRights = loadedSelectedRights;
            }
        }

        setSelectedRepoRights(getSelectedRightsFromIngest(newSelectedRepoRights, selectedIngest));
    }, [search, selectedRights, selectedIngest, gridApi, isRepositoryDataLoading]);

    useEffect(()=> {
        if (selectedGridApi) {
            if (isRepositoryDataLoading) {
                selectedGridApi.clearFocusedCell();
                selectedGridApi.showLoadingOverlay();
            } else {
                selectedGridApi.hideOverlay();
            }
        }
    }, [isRepositoryDataLoading]);

    useEffect(() => {
        if (selectedGridApi && selectedRepoRights.length > 0) {
            selectedGridApi.selectAll();
        }
    }, [selectedRepoRights, selectedGridApi]);

    const columnDefsClone = cloneDeep(columnDefs);

    const createMatchingButtonCellRenderer = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        const indicator = calculateIndicatorType(data);
        const notificationClass = indicator !== INDICATOR_RED ? '--success' : '--error';
        return (
            <CustomActionsCellRenderer id={id}>
                <div>
                    <EditorMediaWrapLeftIcon />
                    <span className={`
                        nexus-c-right-to-match-view__buttons_notification
                        nexus-c-right-to-match-view__buttons_notification${notificationClass}
                    `}
                    />
                </div>
            </CustomActionsCellRenderer>
        );
    };

    const columnDefsWithRedirect = columnDefsClone.map(columnDef => {
        if (columnDef.cellRenderer) {
            columnDef.cellRendererParams = {
                link: '/avails/rights/'
            };
        }
        return columnDef;
    });

    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn();
    const actionMatchingButtonColumnDef = defineButtonColumn({
        cellRendererFramework: createMatchingButtonCellRenderer,
        cellEditorFramework: TooltipCellEditor,
        editable: true
    });
    const updatedColumnDefs = columnDefsWithRedirect.length
        ? [checkboxSelectionColumnDef, actionMatchingButtonColumnDef, ...columnDefsWithRedirect]
        : columnDefsWithRedirect;

    const checkboxSelectionWithHeaderColumnDef = defineCheckboxSelectionColumn({
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
    });
    const updatedColumnDefsCheckBoxHeader = columnDefsWithRedirect.length
        ? [checkboxSelectionWithHeaderColumnDef, actionMatchingButtonColumnDef, ...columnDefsWithRedirect]
        : columnDefsWithRedirect;

    const onRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, SELECTION_CHANGED, FILTER_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY:
                setGridApi(api);
                setColumnApi(columnApi);
                break;
            case SELECTION_CHANGED:
                const clonedSelectedRights = cloneDeep(selectedRights);

                // Get selected rows from both tables
                const rightsTableSelectedRows = api.getSelectedRows() || [];
                const selectedTableSelectedRows = selectedGridApi.getSelectedRows() || [];

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
                if(!selectedIngest
                    && rightsTableSelectedRows.length === selectedTableSelectedRows.length
                    && clonedSelectedRights.length > rightsTableSelectedRows.length
                ) {
                    // Filter out the selected rights whose rows are not selected. Basically finding the row
                    // that was just deselected.
                    const updatedSelectedRights = clonedSelectedRights.filter(right => allSelectedRowsIds.includes(right.id));

                    // Pack the new selected rights into a payload for the store update; converts array of objects
                    // to object of objects where the keys are object(right) ids.
                    const payload = updatedSelectedRights.reduce((o, curr) => (o[curr.id] = curr, o), {});
                    setSelectedRights(payload);
                    break;
                }

                // Select/deselect process
                api.forEachNode((node) => {
                    const {data = {}} = node;

                    const wasSelected = clonedSelectedRights.find(el => el.id === data.id) !== undefined;

                    // If it was selected and currently is not, then add it to the list of values to be deselected
                    // otherwise add it to selected rights
                    if (wasSelected && !node.isSelected()) {
                        idsToRemove.push(data.id);
                    } else if (!wasSelected && node.isSelected()) {
                        clonedSelectedRights.push(data);
                    }
                });

                // Filter out rights that were deselected
                const updatedSelectedRights = clonedSelectedRights.filter(el => !idsToRemove.includes(el.id));

                // Pack the new selected rights into a payload for the store update; converts array of objects
                // to object of objects where the keys are object(right) ids.
                const payload = updatedSelectedRights.reduce((o, curr) => (o[curr.id] = curr, o), {});
                setSelectedRights(payload);
                break;
            case FILTER_CHANGED:
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
    };

    const onSelectedRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, ROW_DATA_CHANGED, SELECTION_CHANGED, FILTER_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY:
                setSelectedGridApi(api);
                setSelectedColumnApi(columnApi);
                break;
            case SELECTION_CHANGED:
                // Get IDs from all selected rights from selectedRights ag-grid table
                const allSelectedRowsIds = api.getSelectedRows().map(({id}) => id);

                // Get ID of a right to be deselected
                const toDeselectIds = selectedRepoRights
                    .map(({id}) => id)
                    .filter(selectedRepoId => !allSelectedRowsIds.includes(selectedRepoId));

                // Get all selected nodes from main ag-grid table and filter only ones to deselect
                const nodesToDeselect = gridApi.getSelectedNodes().filter(({data = {}}) => toDeselectIds.includes(data.id));

                // If row was unselected but it was not found via gridApi, then manually deselect it and
                // update the store. Otherwise proceed with normal flow via gridApi and update the store via
                // onRightsRepositoryGridEvent handler
                if (!nodesToDeselect.length && api.getSelectedRows().length < selectedRepoRights.length) {
                    setSelectedRights(selectedRepoRights.filter(({id}) => !toDeselectIds.includes(id)));
                } else {
                    nodesToDeselect.forEach(node => node.setSelected(false));
                }
                break;
            case ROW_DATA_CHANGED:
                api.setFilterModel(selectedFilter);
                break;
            case FILTER_CHANGED:
                setSelectedFilter(api.getFilterModel());
                break;
        }
    };

    // Returns only selected rights that are also included in the selected ingest
    const getSelectedRightsFromIngest = (selectedRights, selectedIngest = {}) => {
        const {id} = selectedIngest || {};

        // If an ingest is selected, provide only selected rights that also belong to the ingest.
        // Otherwise return all selected rights.
        return (
            id
                ? selectedRights.filter(({availHistoryId}) => (availHistoryId === id))
                : selectedRights
        );
    };

    return (
        <div className="nexus-c-rights-repository">
            <RightsRepositoryHeader />
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
            <NexusTableToolbar
                title="Rights"
                totalRows={totalCount}
                selectedRightsCount={selectedRepoRights.length}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                selectedRows={selectedRights}
                rightsFilter={rightsFilter}
                rightColumnApi={columnApi}
                selectedRightColumnApi={selectedColumnApi}
                selectedRightGridApi={selectedGridApi}
                selectedRepoRights={selectedRepoRights}
            />
            <SelectedRightsRepositoryTable
                id='selectedRightsRepo'
                columnDefs={updatedColumnDefsCheckBoxHeader}
                singleClickEdit
                rowSelection="multiple"
                suppressRowClickSelection={true}
                mapping={mapping}
                rowData={selectedRepoRights}
                isGridHidden={activeTab !== RIGHTS_SELECTED_TAB}
                onGridEvent={onSelectedRightsRepositoryGridEvent}
            />
            <RightsRepositoryTable
                id='rightsRepo'
                columnDefs={updatedColumnDefs}
                rowSelection="multiple"
                suppressRowClickSelection={true}
                singleClickEdit
                context={{selectedRows: selectedRights}}
                mapping={mapping}
                setTotalCount={setTotalCount}
                onGridEvent={onRightsRepositoryGridEvent}
                isGridHidden={activeTab !== RIGHTS_TAB}
                initialFilter={rightsFilter.column}
                params={rightsFilter.external}
                setDataLoading={setIsRepositoryDataLoading}
            />
        </div>
    );
};

const mapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();
    const availsMappingSelector = createAvailsMappingSelector();
    const selectedRightsSelector = selectors.createSelectedRightsSelector();
    const rightsFilterSelector = selectors.createRightsFilterSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        selectedIngest: getSelectedIngest(state),
        selectedAttachmentId: getSelectedAttachmentId(state),
        selectedRights: selectedRightsSelector(state, props),
        rightsFilter: rightsFilterSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    filterByStatus: payload => dispatch(filterRightsByStatus(payload)),
    ingestClick: () => dispatch(selectIngest()),
    setSelectedRights: payload => dispatch(setSelectedRights(payload)),
    deselectIngest: () => dispatch(deselectIngest()),
    downloadIngestEmail: payload  => dispatch(downloadEmailAttachment(payload)),
    downloadIngestFile: payload  => dispatch(downloadFileAttachment(payload)),
    setRightsFilter: payload => dispatch(setRightsFilter(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepository);
