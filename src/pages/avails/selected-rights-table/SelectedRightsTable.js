import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withSelectableRows from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSelectableRows';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {useDispatch} from 'react-redux';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';
import {setSelectedRights, setSelectedRightsColDef} from '../rights-repository/rightsActions';
import {commonDragStoppedHandler} from '../rights-repository/util/utils';

const SelectedRightsGrid = compose(
    withColumnsResizing(),
    withFilterableColumns(),
    withSideBar(),
    withSorting(),
    withSelectableRows()
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
                columnApi?.applyColumnState({state: columnDefs, applyOrder: true});
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
        const currentColumnDefs = gridApi.getColumnDefs();
        const updatedMappings = commonDragStoppedHandler(event, currentColumnDefs, mapping);
        dispatch(setSelectedRightsColDef(updatedMappings));
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
    selectedRights: PropTypes.array,
    username: PropTypes.string,
    selectedIngest: PropTypes.object,
    storeGridApi: PropTypes.func.isRequired,
};

SelectedRightsTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    selectedFilter: {},
    setSelectedFilter: () => null,
    selectedRights: [],
    username: {},
    selectedIngest: {},
};

export default SelectedRightsTable;
