import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {cloneDeep} from 'lodash';
import {useDispatch} from 'react-redux';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';
import {setSelectedRights} from '../rights-repository/rightsActions';

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
    selectedRights,
    username,
    selectedIngest,
    storeGridApi,
    setTableColumnDefinitions,
}) => {
    const [selectedRightsState, setSelectedRightsState] = useState([...selectedRights]);
    const [gridApi, setGridApi] = useState(undefined);
    const [columnApiState, setColumnApiState] = useState(undefined);
    const dispatch = useDispatch();

    useEffect(() => {
        // Reselect rows that were already selected by user
        if (selectedRightsState.length && gridApi) {
            const selectedRightsIds = selectedRights.map(x => x.id);
            gridApi.forEachNode(node => {
                node.setSelected(selectedRightsIds.includes(node.data.id), false, true);
            });
        }
    }, [selectedRightsState]);

    useEffect(() => {
        // Merge displayed selected rights (api with already existing data) to refresh state of data
        setSelectedRightsState(prev =>
            prev.map(right => {
                if (selectedRights.find(selR => selR.id === right.id)) {
                    return selectedRights.find(selR => selR.id === right.id);
                }
                return right;
            })
        );
    }, [selectedRights]);

    const setGridApis = (api, columnApi) => {
        !gridApi && setGridApi(api);
        !columnApiState && setColumnApiState(columnApi);
        storeGridApi(api, columnApi);
    };

    const onSelectedRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, ROW_DATA_CHANGED, SELECTION_CHANGED, FILTER_CHANGED} = GRID_EVENTS;

        switch (type) {
            case READY:
                setGridApis(api, columnApi);
                break;
            case SELECTION_CHANGED: {
                const rightsNonSelectedIngest = selectedIngest?.id
                    ? selectedRights.filter(x => x.availHistoryId !== selectedIngest?.id)
                    : [];
                dispatch(setSelectedRights({[username]: [...api.getSelectedRows(), ...rightsNonSelectedIngest]}));
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
    };

    const dragStoppedHandler = event => {
        const updatedMappings = columnDefs.length ? cloneDeep(columnDefs) : cloneDeep(mapping);
        const columnHeader = event.target.textContent.trim();
        const columns = event.columnApi?.columnModel?.getAllGridColumns();

        const moveTo = columns.findIndex(col => col.colDef.headerName === columnHeader);
        const moveFrom = updatedMappings.findIndex(col => col.headerName === columnHeader);
        const [movedColumn] = updatedMappings.splice(moveFrom, 1);
        updatedMappings.splice(moveTo, 0, movedColumn);

        setTableColumnDefinitions(updatedMappings);
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
            rowData={selectedRightsState}
            dragStopped={dragStoppedHandler}
        />
    );
};

SelectedRightsTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    selectedFilter: PropTypes.object,
    setSelectedFilter: PropTypes.func,
    selectedRights: PropTypes.object,
    username: PropTypes.string,
    selectedIngest: PropTypes.object,
    storeGridApi: PropTypes.func.isRequired,
    setTableColumnDefinitions: PropTypes.func,
};

SelectedRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    selectedFilter: {},
    setSelectedFilter: () => null,
    selectedRights: {},
    username: {},
    selectedIngest: {},
    setTableColumnDefinitions: () => null,
};

export default SelectedRightsTable;
