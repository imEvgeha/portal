import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import cloneDeep from 'lodash.clonedeep';
import './RightsRepository.scss';
import withSideBar from '../../ui-elements/nexus-grid/hoc/withSideBar';
import withFilterableColumns from '../../ui-elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {rightServiceManager} from '../../containers/avail/service/RightServiceManager';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import * as selectors from './rightsSelectors';
import {setSelectedRights} from './rightsActions';
import {createRightMatchingColumnDefsSelector, createAvailsMappingSelector} from '../right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../right-matching/rightMatchingActions';
import {createLinkableCellRenderer} from '../utils';
import Ingest from './components/ingest/Ingest';
import {filterRightsByStatus, selectIngest} from '../ingest-panel/ingestActions';
import {getSelectedIngest} from '../ingest-panel/ingestSelectors';
import RightsRepositoryHeader from '../components/RightsRepositoryHeader';
import NexusTableToolbar from '../../ui-elements/nexus-table-toolbar/NexusTableToolbar';
import {defineCheckboxSelectionColumn} from '../../ui-elements/nexus-grid/elements/columnDefinitions';
import {GRID_EVENTS} from '../../ui-elements/nexus-grid/constants';

const RightsRepositoryTable = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: rightServiceManager.doSearch}),
)(NexusGrid);

const SelectedRighstRepository = compose(
    withSideBar(),
    withFilterableColumns(),
)(NexusGrid);

const RightsRepository = props => {
    const {columnDefs, createRightMatchingColumnDefs, mapping, selectedIngest, filterByStatus, ingestClick, setSelectedRights, getSelectedRows} = props;
    const [totalCount, setTotalCount] = useState(0);
    const [isSelectedOptionActive, setIsSelectedOptionActive] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
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
        switch (type) {
            case GRID_EVENTS.SELECTION_CHANGED:
                const allSelectedRows = api.getSelectedRows() || [];
                setSelectedRows(allSelectedRows);
                const payload = allSelectedRows.reduce((o, curr) => (o[curr.id] = curr, o), {});
                setSelectedRights(payload);
                break;
            case GRID_EVENTS.READY:
                setGridApi(api);
                break;
        }
    };


    return(
        <div className="nexus-c-rights-repository">
            <RightsRepositoryHeader />
            {selectedIngest && (<Ingest ingest={selectedIngest} filterByStatus={filterByStatus} />)}
            <NexusTableToolbar
                title="Rights"
                totalRows={totalCount}
                setIsSelectedOptionActive={setIsSelectedOptionActive}
                isSelectedOptionActive={isSelectedOptionActive}
                selectedRows={selectedRows.length}
            />
            <SelectedRighstRepository
                columnDefs={columnDefsWithRedirect}
                mapping={mapping}
                rowData={selectedRows}
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
