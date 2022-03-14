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
import {setSelectedRights, storeFromSelectedTable} from '../rights-repository/rightsActions';

const SelectedRightsGrid = compose(
    withColumnsResizing(),
    withFilterableColumns(),
    withSideBar(),
    withSorting()
)(NexusGrid);

const SelectedRightsTable = ({
    columnDefs,
    mapping,
    selectedFilter,
    setSelectedFilter,
    selectedRepoRights,
    selectedRights,
    username,
    storeGridApi,
}) => {
    const [currentUserSelectedRights, setCurrentUserSelectedRights] = useState([]);
    const [gridApi, setGridApi] = useState(undefined);
    const [columnApiState, setColumnApiState] = useState(undefined);
    const dispatch = useDispatch();

    useEffect(() => {
        const usersSelectedRights = get(selectedRights, username, {});
        setCurrentUserSelectedRights(Object.values(usersSelectedRights));
        // gridApi?.forEachNode(node => node?.setSelected(true, false, true));
    }, []);

    const setGridApis = (api, columnApi) => {
        !gridApi && setGridApi(api);
        !columnApiState && setColumnApiState(columnApi);
        setGridApi(api);
    };

    const onSelectedRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, ROW_DATA_CHANGED, SELECTION_CHANGED, FILTER_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;

        switch (type) {
            case READY:
                setGridApis(api, columnApi);
                break;
            case FIRST_DATA_RENDERED:
                api.selectAll();
                break;
            case SELECTION_CHANGED: {
                dispatch(setSelectedRights({[username]: api.getSelectedRows()}));
                break;
            }
            case ROW_DATA_CHANGED:
                api.setFilterModel(selectedFilter);
                break;
            case FILTER_CHANGED:
                setSelectedFilter(api.getFilterModel());
                // !gridApi && setGridApi(api);
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
        />
    );
};

SelectedRightsTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    selectedRepoRights: PropTypes.array,
    selectedFilter: PropTypes.object,
    setSelectedFilter: PropTypes.func,
    selectedRights: PropTypes.object,
    username: PropTypes.string,
    storeGridApi: PropTypes.func.isRequired,
};

SelectedRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    selectedRepoRights: [],
    selectedFilter: {},
    setSelectedFilter: () => null,
    selectedRights: {},
    username: {},
};

export default SelectedRightsTable;
