import React, {useState, useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {get, isEmpty} from 'lodash';
import {useDispatch} from 'react-redux';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';
import useRowCountWithGridApiFix from '../../../util/hooks/useRowCountWithGridApiFix';
import {RIGHTS_SELECTED_TAB} from '../rights-repository/constants';
import {setSelectedRights, storeFromSelectedTable} from '../rights-repository/rightsActions';

// /* eslint-disable no-unused-expressions, no-magic-numbers, no-console */

const SelectedRightsGrid = compose(
    withColumnsResizing(),
    withFilterableColumns(),
    withSideBar(),
    withSorting()
)(NexusGrid);

const SelectedRightsTable = ({
    columnDefs,
    mapping,
    activeTab,

    selectedGridApi,
    setSelectedGridApi,
    selectedColumnApi,
    setSelectedColumnApi,
    gridApi,

    selectedFilter,
    setSelectedFilter,
    selectedRepoRights,

    selectedRights,
    username,
}) => {
    // const { api: gridApi, setApi: setGridApi } = useRowCountWithGridApiFix()
    // const [selectedGridApi, setSelectedGridApi] = useState(null);
    //  const [selectedColumnApi, setSelectedColumnApi] = useState(null);

    const [currentUserSelectedRights, setCurrentUserSelectedRights] = useState([]);
    console.log('%ccurrentUserSelectedRights', 'color: lawngreen; font-size: 12px;', currentUserSelectedRights);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isEmpty(selectedRights) && username && gridApi) {
            const usersSelectedRights = get(selectedRights, username, {});
            setCurrentUserSelectedRights(Object.values(usersSelectedRights));
        }
    }, [activeTab === 'Selected']);

    useEffect(() => {
        if (!isEmpty(selectedRights) && username && currentUserSelectedRights && gridApi) {
            // gridApi?.forEachNode(node => node?.setSelected(true));
            selectedGridApi?.forEachNode(node => node?.setSelected(true));
        }
    }, [activeTab]);

    const onSelectedRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, ROW_DATA_CHANGED, SELECTION_CHANGED, FILTER_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;

        switch (type) {
            case FIRST_DATA_RENDERED:
                !selectedGridApi && setSelectedGridApi(api);
                !selectedColumnApi && setSelectedColumnApi(columnApi);

                // setGridApi && setGridApi(api);
                // !selectedColumnApi && setSelectedColumnApi(columnApi);

                api?.forEachNode(node => node?.setSelected(true));

                break;
            case READY:
                !selectedGridApi && setSelectedGridApi(api);
                !selectedColumnApi && setSelectedColumnApi(columnApi);

                // setGridApi && setGridApi(api);
                // !selectedColumnApi && setSelectedColumnApi(columnApi);

                api?.forEachNode(node => node?.setSelected(true));
                break;
            case SELECTION_CHANGED: {
                if (activeTab === RIGHTS_SELECTED_TAB) {
                    const allSelectedRowsIds = api?.getSelectedNodes()?.map(row => row.data.id);

                    // Get ID of a right to be deselected
                    const toDeselectIds = selectedRepoRights
                        .map(({id}) => id)
                        .filter(selectedRepoId => !allSelectedRowsIds.includes(selectedRepoId));

                    // Get all selected nodes from main ag-grid table and filter only ones to deselect
                    const nodesToDeselect = api
                        ?.getSelectedNodes()
                        ?.filter(({data = {}}) => toDeselectIds.includes(data.id));

                    nodesToDeselect?.forEach(node => node?.setSelected(false));

                    const updateSelectedRowsIds = api?.getSelectedNodes()?.map(row => row.data.id);

                    const updatedState = currentUserSelectedRights.filter(right =>
                        updateSelectedRowsIds.includes(right.id)
                    );

                    const payload = updatedState.reduce((selectedRights, currentRight) => {
                        selectedRights[currentRight.id] = currentRight;
                        // delete selectedRights.undefined;
                        return selectedRights;
                    }, {});

                    const formatedRights = {[username]: payload};

                    // dispatch(storeFromSelectedTable(formatedRights))
                    dispatch(setSelectedRights(formatedRights));
                }

                break;
            }
            case ROW_DATA_CHANGED:
                api.setFilterModel(selectedFilter);
                break;
            case FILTER_CHANGED:
                setSelectedFilter(api.getFilterModel());
                !selectedGridApi && setSelectedGridApi(api);
                break;
            default:
                break;
        }
    };

    return (
        <SelectedRightsGrid
            id="selectedRightsRepo"
            singleClickEdit
            suppressRowClickSelection={true}
            notFilterableColumns={['action', 'buttons']}
            columnDefs={columnDefs}
            onGridEvent={onSelectedRightsRepositoryGridEvent}
            rowSelection="multiple"
            mapping={mapping}
            rowData={currentUserSelectedRights}
            setSelectedColumnApi={setSelectedColumnApi}
            setSelectedGridApi={setSelectedGridApi}
            isGridHidden={activeTab !== RIGHTS_SELECTED_TAB}
        />
    );
};

SelectedRightsTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    activeTab: PropTypes.string.isRequired,
    onGridEvent: PropTypes.func,
    rowData: PropTypes.array,
    selectedRepoRights: PropTypes.array,
    gridApi: PropTypes.object,
    selectedGridApi: PropTypes.object,
    setSelectedGridApi: PropTypes.func,
    selectedColumnApi: PropTypes.object,
    setSelectedColumnApi: PropTypes.func,
    selectedFilter: PropTypes.object,
    setSelectedFilter: PropTypes.func,
    selectedRights: PropTypes.object,
    setSelectedRights: PropTypes.func,
    username: PropTypes.string,
};

SelectedRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    rowData: [],
    onGridEvent: () => null,
    selectedRepoRights: [],
    gridApi: {},
    selectedGridApi: {},
    setSelectedGridApi: () => null,
    selectedColumnApi: {},
    setSelectedColumnApi: () => null,
    selectedFilter: {},
    setSelectedFilter: () => null,
    selectedRights: {},
    setSelectedRights: () => null,
    username: {},
};

export default SelectedRightsTable;
