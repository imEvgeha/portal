import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withSelectableRows from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSelectableRows';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {useDispatch} from 'react-redux';
import {compose} from 'redux';

const SelectedTitlesGrid = compose(
    withColumnsResizing(),
    withFilterableColumns(),
    withSideBar(),
    withSorting(),
    withSelectableRows()
)(NexusGrid);

const SelectedTitlesTable = ({
    columnDefs,
    mapping,
    selectedFilter,
    setSelectedFilter,
    selectedTitles,
    setSelectedTitles,
    username,
}) => {
    const [selectedTitlesState, setSelectedTitlesState] = useState([...selectedTitles]);
    const [gridApi, setGridApi] = useState(undefined);
    const [columnApiState, setColumnApiState] = useState(undefined);
    const dispatch = useDispatch();

    useEffect(() => {
        // Reselect rows that were already selected by user
        if (selectedTitlesState.length && gridApi) {
            const selectedTitlesIds = selectedTitles.map(x => x.id);
            gridApi.forEachNode(node => {
                node.setSelected(selectedTitlesIds.includes(node.data.id), false, true);
            });
        }
    }, [selectedTitlesState, gridApi]);

    useEffect(() => {
        // Merge displayed selected Titles (api with already existing data) to refresh state of data
        setSelectedTitlesState(prev =>
            prev.map(right => {
                if (selectedTitles.find(selR => selR.id === right.id)) {
                    return selectedTitles.find(selR => selR.id === right.id);
                }
                return right;
            })
        );
    }, [selectedTitles]);

    const setGridApis = (api, columnApi) => {
        !gridApi && setGridApi(api);
        !columnApiState && setColumnApiState(columnApi);
    };

    const onSelectedTitlesRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, ROW_DATA_CHANGED, SELECTION_CHANGED, FILTER_CHANGED} = GRID_EVENTS;

        switch (type) {
            case READY:
                setGridApis(api, columnApi);
                columnApi?.applyColumnState({state: columnDefs, applyOrder: true});
                break;
            case SELECTION_CHANGED: {
                dispatch(setSelectedTitles({[username]: [...api.getSelectedRows()]}));
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

    return (
        <SelectedTitlesGrid
            id="selectedTitlesRepo"
            singleClickEdit
            suppressRowClickSelection={true}
            notFilterableColumns={['action', 'buttons']}
            columnDefs={columnDefs}
            onGridEvent={onSelectedTitlesRepositoryGridEvent}
            rowSelection="multiple"
            mapping={mapping}
            rowData={selectedTitlesState}
        />
    );
};

SelectedTitlesTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    selectedFilter: PropTypes.object,
    setSelectedFilter: PropTypes.func,
    selectedTitles: PropTypes.array,
    setSelectedTitles: PropTypes.func,
    username: PropTypes.string,
};

SelectedTitlesTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    selectedFilter: {},
    setSelectedFilter: () => null,
    selectedTitles: [],
    setSelectedTitles: () => null,
    username: {},
};

export default SelectedTitlesTable;
