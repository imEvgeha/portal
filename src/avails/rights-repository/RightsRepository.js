import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import cloneDeep from 'lodash.clonedeep';
import './RightsRepository.scss';
import {rightsService} from '../../containers/avail/service/RightsService';
import * as selectors from './rightsSelectors';
import {setSelectedRights, setRightsFilter} from './rightsActions';
import {createRightMatchingColumnDefsSelector, createAvailsMappingSelector} from '../right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../right-matching/rightMatchingActions';
import {createLinkableCellRenderer} from '../utils';
import Ingest from './components/ingest/Ingest';
import {filterRightsByStatus, selectIngest} from '../ingest-panel/ingestActions';
import {getSelectedIngest} from '../ingest-panel/ingestSelectors';
import RightsRepositoryHeader from './components/RightsRepositoryHeader';
import {GRID_EVENTS} from '../../ui-elements/nexus-grid/constants';
import {defineCheckboxSelectionColumn} from '../../ui-elements/nexus-grid/elements/columnDefinitions';
import withFilterableColumns from '../../ui-elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../ui-elements/nexus-grid/hoc/withSideBar';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import UiElements from '../../ui-elements';

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
        setRightsFilter,
        rightsFilter,
    } = props;
    const [totalCount, setTotalCount] = useState(0);
    const [isSelectedOptionActive, setIsSelectedOptionActive] = useState(false);
    const [gridApi, setGridApi] = useState();

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

    const columnDefsWithRedirect = columnDefsClone.map(columnDef => {
        if(columnDef.cellRenderer) {
            columnDef.cellRenderer = handleRightRedirect;
        }
        return columnDef;
    });

    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn({headerName: 'Actions'});
    const updatedColumnDefs = columnDefsWithRedirect.length
        ? [checkboxSelectionColumnDef, ...columnDefsWithRedirect]
        : columnDefsWithRedirect;

    const onRightsRepositoryGridEvent = ({type, api}) => {
        if (type === GRID_EVENTS.SELECTION_CHANGED) {
            const allSelectedRows = api.getSelectedRows() || [];
            const payload = allSelectedRows.reduce((o, curr) => (o[curr.id] = curr, o), {});
            setSelectedRights(payload);
        } else if (type === GRID_EVENTS.READY) {
            setGridApi(api);
        }
    };

    return (
        <div className="nexus-c-rights-repository">
            <RightsRepositoryHeader />
            {selectedIngest && (<Ingest ingest={selectedIngest} filterByStatus={filterByStatus} gridApi={gridApi} />)}
            <NexusTableToolbar
                title="Rights"
                totalRows={totalCount}
                setIsSelectedOptionActive={setIsSelectedOptionActive}
                isSelectedOptionActive={isSelectedOptionActive}
                selectedRows={Object.keys(selectedRights).length}
            />
            <SelectedRighstRepositoryTable
                columnDefs={columnDefsWithRedirect}
                mapping={mapping}
                rowData={Object.keys(selectedRights).map(key => selectedRights[key])}
                isGridHidden={!isSelectedOptionActive}
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
                filterAction={setRightsFilter}
                initialFilter={rightsFilter.column}
                params={rightsFilter.external}
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
    setRightsFilter: payload => dispatch(setRightsFilter(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepository);
