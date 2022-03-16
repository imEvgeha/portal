import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {isEmpty} from 'lodash';
import {compose} from 'redux';
import {NexusGrid} from '../../../../ui/elements';

const SelectedPreplanGrid = compose(withColumnsResizing(), withSideBar(), withEditableColumns())(NexusGrid);

const SelectedPreplanTable = ({
    columnDefs,
    mapping,
    // selectedRepoRights,
    selectedRights,
    username,
    setSelectedPrePlanRights,
}) => {
    const [currentUserSelectedRights, setCurrentUserSelectedRights] = useState([]);
    const [gridApi, setGridApi] = useState(undefined);
    const [columnApi, setColumnApi] = useState(undefined);

    useEffect(() => {
        if (!isEmpty(selectedRights) && username && gridApi) {
            setCurrentUserSelectedRights(Object.values(selectedRights));
        }

        if (!isEmpty(selectedRights) && username && currentUserSelectedRights && gridApi?.forEachNode) {
            gridApi.forEachNode(node => node?.setSelected(true));
        }
    }, [gridApi]);

    const onSelectedRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, SELECTION_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;

        switch (type) {
            case READY:
                !gridApi && setGridApi(api);
                !columnApi && setColumnApi(columnApi);
                break;
            case FIRST_DATA_RENDERED:
                api.selectAll();
                break;
            case SELECTION_CHANGED:
                setSelectedPrePlanRights(api.getSelectedRows());
                break;
            default:
                break;
        }
    };

    return (
        <SelectedPreplanGrid
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

SelectedPreplanTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    // selectedRepoRights: PropTypes.array,
    selectedRights: PropTypes.array,
    username: PropTypes.string,
    setSelectedPrePlanRights: PropTypes.func.isRequired,
};

SelectedPreplanTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    // selectedRepoRights: [],
    selectedRights: [],
    username: {},
};

export default SelectedPreplanTable;
