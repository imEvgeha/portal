import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import './RightsRepository.scss';
import {rightsService} from '../../containers/avail/service/RightsService';
import * as selectors from './rightsSelectors';
import {addRightsFilter, setRightsFilter, setSelectedRights} from './rightsActions';
import {
    createAvailsMappingSelector,
    createRightMatchingColumnDefsSelector
} from '../right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../right-matching/rightMatchingActions';
import {createLinkableCellRenderer} from '../utils';
import Ingest from './components/ingest/Ingest';
import {
    deselectIngest,
    downloadEmailAttachment,
    filterRightsByStatus,
    selectIngest
} from '../ingest-panel/ingestActions';
import {getSelectedAttachmentId, getSelectedIngest} from '../ingest-panel/ingestSelectors';
import RightsRepositoryHeader from './components/RightsRepositoryHeader';
import {GRID_EVENTS} from '../../ui-elements/nexus-grid/constants';
import {
    defineButtonColumn,
    defineCheckboxSelectionColumn
} from '../../ui-elements/nexus-grid/elements/columnDefinitions';
import withFilterableColumns from '../../ui-elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../ui-elements/nexus-grid/hoc/withSideBar';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {NexusGrid, NexusTableToolbar} from '../../ui-elements';
import {filterBy} from '../../ui-elements/nexus-grid/utils';
import usePrevious from '../../util/hooks/usePrevious';
import {calculateIndicatorType, INDICATOR_SUCCESS, INDICATOR_RED} from './util/indicator';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import TooltipCellEditor from './components/tooltip/TooltipCellEditor';
import {URL} from '../../util/Common';
import constants from '../constants';

export const RIGHTS_TAB = 'RIGHTS_TAB';
export const RIGHTS_SELECTED_TAB = 'RIGHTS_SELECTED_TAB';

const RightsRepositoryTable = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: rightsService.advancedSearch}),
)(NexusGrid);

const SelectedRighstRepositoryTable = compose(
    withSideBar(),
    withFilterableColumns(),
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
        addRightsFilter,
        setRightsFilter,
        rightsFilter,
        deselectIngest,
        downloadIngestEmail,
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

    useEffect(() => {
        gridApi && gridApi.setFilterModel(null);
    }, [selectedIngest, selectedAttachmentId]);


    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, createRightMatchingColumnDefs]);

    useEffect(() => {
        ingestClick();
    }, []);

    useEffect(() => {
        if(selectedIngest && selectedAttachmentId) {
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
        setSelectedRepoRights(getSelectedTabRights(selectedRights));
    }, [window.location.search]);

    const columnDefsClone = cloneDeep(columnDefs);
    const handleRightRedirect = params => createLinkableCellRenderer(params, '/avails/rights/');

    const createMatchingButtonCellRenderer = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        const indicator = calculateIndicatorType(data);
        const notificationClass = indicator !== INDICATOR_RED ? '--success' : '--error';
        return (
            <CustomActionsCellRenderer id={id}>
                <div>
                    <EditorMediaWrapLeftIcon/>
                    <span className={'nexus-c-right-to-match-view__buttons_notification  nexus-c-right-to-match-view__buttons_notification' + notificationClass}/>
                </div>
            </CustomActionsCellRenderer>
        );
    };

    const columnDefsWithRedirect = columnDefsClone.map(columnDef => {
        if(columnDef.cellRenderer) {
            columnDef.cellRenderer = handleRightRedirect;
        }
        return columnDef;
    });

    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn();
    const actionMatchingButtonColumnDef = defineButtonColumn({cellRendererFramework: createMatchingButtonCellRenderer, cellEditorFramework: TooltipCellEditor, editable: true});
    const updatedColumnDefs = columnDefsWithRedirect.length
        ? [checkboxSelectionColumnDef, actionMatchingButtonColumnDef, ...columnDefsWithRedirect]
        : columnDefsWithRedirect;
    const checkboxSelectionWithHeaderColumnDef = {headerCheckboxSelection: true, ...checkboxSelectionColumnDef};
    const updatedColumnDefsCheckBoxHeader = columnDefsWithRedirect.length
        ? [checkboxSelectionWithHeaderColumnDef, actionMatchingButtonColumnDef, ...columnDefsWithRedirect]
        : columnDefsWithRedirect;

    const onRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        switch (type) {
            case GRID_EVENTS.SELECTION_CHANGED:
                const allSelectedRows = api.getSelectedRows() || [];
                setSelectedRepoRights(getSelectedTabRights(allSelectedRows));
                selectedGridApi.selectAll();

                const payload = allSelectedRows.reduce((o, curr) => (o[curr.id] = curr, o), {});
                setSelectedRights(payload);
                break;
            case GRID_EVENTS.READY:
                setGridApi(api);
                setColumnApi(columnApi);
                break;
            case GRID_EVENTS.FILTER_CHANGED:
                const column = filterBy(api.getFilterModel());
                if (Object.keys(column).length === 0) {
                    let filter = Object.assign({}, rightsFilter);
                    delete filter.column;
                    setRightsFilter(filter);
                } else {
                    setRightsFilter({...rightsFilter, column});
                }
                break;
        }
    };

    const onSelectedRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        switch (type) {
            case GRID_EVENTS.READY:
                setSelectedGridApi(api);
                setSelectedColumnApi(columnApi);
                break;
            case GRID_EVENTS.SELECTION_CHANGED:
                const allSelectedRows = api.getSelectedRows() || [];
                const toUnselect = selectedRepoRights.filter(el => !allSelectedRows.map(({id}) => id).includes(el.id));
                toUnselect.forEach(el => {
                    const node = gridApi.getRowNode(el.id);
                    node && node.setSelected(false);
                });
                break;
        }
    };

    const getSelectedTabRights = (selectedRights) => {

        const availHistoryIdsParam = URL.getParamIfExists(constants.AVAIL_HISTORY_ID);
        const ingestHistoryAttachmentIdParam = URL.getParamIfExists(constants.INGEST_HISTORY_ATTACHMENT_IDS);

        if(availHistoryIdsParam && ingestHistoryAttachmentIdParam) {
            return selectedRights.filter(el => {
                const {availHistoryIds, ingestHistoryAttachmentId} = el;
                return isEqual(availHistoryIds.sort(), availHistoryIdsParam.split(',').sort()) && ingestHistoryAttachmentId === ingestHistoryAttachmentIdParam;
            });
        }
        return selectedRights;
    };

    return (
        <div className="nexus-c-rights-repository">
            <RightsRepositoryHeader />
            {selectedIngest && !isEmpty(selectedIngest) && attachment && (
                <Ingest
                    ingest={selectedIngest}
                    deselectIngest={deselectIngest}
                    downloadIngestEmail={downloadIngestEmail}
                    attachment={attachment}
                    filterByStatus={filterByStatus} />)
            }
            <NexusTableToolbar
                title="Rights"
                totalRows={totalCount}
                selectedRightsCount={selectedRepoRights.length}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                selectedRows={selectedRights}
                rightsFilter={rightsFilter}
                selectedGridApi={selectedGridApi}
                rightColumnApi={columnApi}
                selectedRightColumnApi={selectedColumnApi}
            />
            <SelectedRighstRepositoryTable
                columnDefs={updatedColumnDefsCheckBoxHeader}
                mapping={mapping}
                rowData={selectedRepoRights}
                isGridHidden={activeTab !== RIGHTS_SELECTED_TAB}
                onGridEvent={onSelectedRightsRepositoryGridEvent}
                singleClickEdit
            />
            <RightsRepositoryTable
                columnDefs={updatedColumnDefs}
                mapping={mapping}
                setTotalCount={setTotalCount}
                onGridEvent={onRightsRepositoryGridEvent}
                rowSelection="multiple"
                suppressRowClickSelection={true}
                isGridHidden={activeTab !== RIGHTS_TAB}
                selectedRows={selectedRights}
                initialFilter={rightsFilter.column}
                params={rightsFilter.external}
                singleClickEdit
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
    addRightsFilter: payload => dispatch(addRightsFilter(payload)),
    deselectIngest: () => dispatch(deselectIngest()),
    downloadIngestEmail: payload  => dispatch(downloadEmailAttachment(payload)),
    setRightsFilter: payload => dispatch(setRightsFilter(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepository);
