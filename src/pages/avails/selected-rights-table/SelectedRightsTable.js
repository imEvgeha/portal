/* eslint-disable no-unused-expressions, no-magic-numbers */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {get} from 'lodash';
import {useDispatch} from 'react-redux';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';
import {storeFromSelectedTable} from '../rights-repository/rightsActions';

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
    selectedFilter,
    setSelectedFilter,
    selectedRepoRights,
    selectedRights,
    username,
}) => {
    const [currentUserSelectedRights, setCurrentUserSelectedRights] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const usersSelectedRights = get(selectedRights, username, {});
        setCurrentUserSelectedRights(Object.values(usersSelectedRights));
        selectedGridApi?.forEachNode(node => node?.setSelected(true));
    }, []);

    const onSelectedRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, ROW_DATA_CHANGED, SELECTION_CHANGED, FILTER_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;

        switch (type) {
            case FIRST_DATA_RENDERED:
                !selectedGridApi && setSelectedGridApi(api);
                !selectedColumnApi && setSelectedColumnApi(columnApi);

                api?.forEachNode(node => node?.setSelected(true));

                break;
            case READY:
                !selectedGridApi && setSelectedGridApi(api);
                !selectedColumnApi && setSelectedColumnApi(columnApi);

                api?.forEachNode(node => node?.setSelected(true));
                break;
            case SELECTION_CHANGED: {
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
                    return selectedRights;
                }, {});

                const formatedRights = {[username]: payload};

                dispatch(storeFromSelectedTable(formatedRights));

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
            // isGridHidden={activeTab !== RIGHTS_SELECTED_TAB}
        />
    );
};

SelectedRightsTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    activeTab: PropTypes.string.isRequired,
    selectedRepoRights: PropTypes.array,
    selectedGridApi: PropTypes.object,
    setSelectedGridApi: PropTypes.func,
    selectedColumnApi: PropTypes.object,
    setSelectedColumnApi: PropTypes.func,
    selectedFilter: PropTypes.object,
    setSelectedFilter: PropTypes.func,
    selectedRights: PropTypes.object,
    username: PropTypes.string,
};

SelectedRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    selectedRepoRights: [],
    selectedGridApi: {},
    setSelectedGridApi: () => null,
    selectedColumnApi: {},
    setSelectedColumnApi: () => null,
    selectedFilter: {},
    setSelectedFilter: () => null,
    selectedRights: {},
    username: {},
};

export default SelectedRightsTable;
