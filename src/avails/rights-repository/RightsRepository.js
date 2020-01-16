import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import cloneDeep from 'lodash.clonedeep';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import './RightsRepository.scss';
import {rightServiceManager} from '../../containers/avail/service/RightServiceManager';
import * as selectors from './rightsSelectors';
import {setSelectedRights} from './rightsActions';
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
import {calculateIndicatorType, INDICATOR_NON, INDICATOR_RED} from './util/indicator';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import TooltipCellEditor from './components/tooltip/TooltipCellEditor';

const {NexusGrid, NexusTableToolbar} = UiElements;

const RightsRepositoryTable = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: rightServiceManager.doSearch}),
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
    } = props;
    const [totalCount, setTotalCount] = useState(0);
    const [isSelectedOptionActive, setIsSelectedOptionActive] = useState(false);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, createRightMatchingColumnDefs]);

    useEffect(() => {
        ingestClick();
    }, []);

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
        if (type === GRID_EVENTS.SELECTION_CHANGED) {
            const allSelectedRows = api.getSelectedRows() || [];
            const payload = allSelectedRows.reduce((o, curr) => (o[curr.id] = curr, o), {});
            setSelectedRights(payload);
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
                singleClickEdit={true}
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
                singleClickEdit={true}
            />
        </div>
    );
};

const mapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();
    const availsMappingSelector = createAvailsMappingSelector();
    const selectedRightsSelector = selectors.createSelectedRightsSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        selectedIngest: getSelectedIngest(state),
        selectedRights: selectedRightsSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    filterByStatus: payload => dispatch(filterRightsByStatus(payload)),
    ingestClick: () => dispatch(selectIngest()),
    setSelectedRights: payload => dispatch(setSelectedRights(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepository);
