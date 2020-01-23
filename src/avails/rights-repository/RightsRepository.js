import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import './RightsRepository.scss';
import {rightsService} from '../../containers/avail/service/RightsService';
import * as selectors from './rightsSelectors';
import {setSelectedRights, addRightsFilter} from './rightsActions';
import {createRightMatchingColumnDefsSelector, createAvailsMappingSelector} from '../right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../right-matching/rightMatchingActions';
import {createLinkableCellRenderer} from '../utils';
import Ingest from './components/ingest/Ingest';
import {filterRightsByStatus, selectIngest} from '../ingest-panel/ingestActions';
import {getSelectedIngest} from '../ingest-panel/ingestSelectors';
import RightsRepositoryHeader from './components/RightsRepositoryHeader';
import {GRID_EVENTS} from '../../ui-elements/nexus-grid/constants';
import {
    defineButtonColumn,
    defineCheckboxSelectionColumn
} from '../../ui-elements/nexus-grid/elements/columnDefinitions';
import withFilterableColumns from '../../ui-elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../ui-elements/nexus-grid/hoc/withSideBar';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import UiElements from '../../ui-elements';
import {filterBy} from '../../ui-elements/nexus-grid/utils';
import usePrevious from '../../util/hooks/usePrevious';
import {calculateIndicatorType, INDICATOR_NON, INDICATOR_RED} from './util/indicator';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import TooltipCellEditor from './components/tooltip/TooltipCellEditor';

const {NexusGrid, NexusTableToolbar} = UiElements;

const RightsRepositoryTable = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: rightsService.advancedSearch}),
)(NexusGrid);

const SelectedRighstRepositoryTable = compose(
    withSideBar(),
    withFilterableColumns(),
)(NexusGrid);

const RightsRepository = props => {
    const {
        columnDefs,
        createRightMatchingColumnDefs,
        mapping,
        selectedIngest,
        filterByStatus,
        ingestClick,
        setSelectedRights,
        selectedRights,
        addRightsFilter,
        rightsFilter,
    } = props;
    const [totalCount, setTotalCount] = useState(0);
    const [isSelectedOptionActive, setIsSelectedOptionActive] = useState(false);
    const [gridApi, setGridApi] = useState();
    const previousExternalStatusFilter = usePrevious(rightsFilter && rightsFilter.external && rightsFilter.external.status);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, createRightMatchingColumnDefs]);

    useEffect(() => {
        ingestClick();
    }, []);

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

    const columnDefsClone = cloneDeep(columnDefs);
    const handleRightRedirect = params => createLinkableCellRenderer(params, '/avails/rights/');

    const createMatchingButtonCellRenderer = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        const indicator = calculateIndicatorType(data);
        const notificationClass = indicator !== INDICATOR_RED ? '' : ' nexus-c-right-to-match-view__buttons_notification--error';
        return (
            <CustomActionsCellRenderer id={id}>
                <div>
                    <EditorMediaWrapLeftIcon/>
                    {indicator !== INDICATOR_NON && <span className={'nexus-c-right-to-match-view__buttons_notification' + notificationClass}/>}
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

    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn({headerName: 'Actions'});
    const actionMatchingButtonColumnDef = defineButtonColumn({cellRendererFramework: createMatchingButtonCellRenderer, cellEditorFramework: TooltipCellEditor, editable: true});
    const updatedColumnDefs = columnDefsWithRedirect.length
        ? [checkboxSelectionColumnDef, actionMatchingButtonColumnDef, ...columnDefsWithRedirect]
        : columnDefsWithRedirect;
    const updatedColumnDefsWithRedirect = columnDefsWithRedirect.length
        ? [actionMatchingButtonColumnDef, ...columnDefsWithRedirect]
        : columnDefsWithRedirect;

    const onRightsRepositoryGridEvent = ({type, api}) => {
        switch (type) {
            case GRID_EVENTS.SELECTION_CHANGED:
                const allSelectedRows = api.getSelectedRows() || [];
                const payload = allSelectedRows.reduce((o, curr) => (o[curr.id] = curr, o), {});
                setSelectedRights(payload);
                break;
            case GRID_EVENTS.READY:
                setGridApi(api);
                break;
            case GRID_EVENTS.FILTER_CHANGED:
                addRightsFilter({column: filterBy(api.getFilterModel())});
                break;
        }
    };

    return (
        <div className="nexus-c-rights-repository">
            <RightsRepositoryHeader />
            {selectedIngest && (<Ingest ingest={selectedIngest} filterByStatus={filterByStatus} />)}
            <NexusTableToolbar
                title="Rights"
                totalRows={totalCount}
                setIsSelectedOptionActive={setIsSelectedOptionActive}
                isSelectedOptionActive={isSelectedOptionActive}
                selectedRows={Object.keys(selectedRights).length}
            />
            <SelectedRighstRepositoryTable
                columnDefs={updatedColumnDefsWithRedirect}
                mapping={mapping}
                rowData={Object.keys(selectedRights).map(key => selectedRights[key])}
                isGridHidden={!isSelectedOptionActive}
                singleClickEdit
            />
            <RightsRepositoryTable
                columnDefs={updatedColumnDefs}
                mapping={mapping}
                setTotalCount={setTotalCount}
                onGridEvent={onRightsRepositoryGridEvent}
                rowSelection="multiple"
                suppressRowClickSelection={true}
                isGridHidden={isSelectedOptionActive}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepository);
