import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import withSelectableRows from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSelectableRows';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {compose} from 'redux';
import {NexusGrid} from '../../../../../ui/elements';
import columnMappings from '../../columnMappings';

const SelectedStatusGrid = compose(
    withColumnsResizing(),
    withSideBar(),
    withEditableColumns(),
    withSelectableRows()
)(NexusGrid);

const SelectedStatusTable = ({columnDefs, selectedStatusRights, setSelectedStatusRights}) => {
    const [selectedRights] = useState([...selectedStatusRights]);

    const onGridReady = ({type, api}) => {
        const {READY, SELECTION_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;
        switch (type) {
            case READY:
                api.sizeColumnsToFit();
                break;
            case FIRST_DATA_RENDERED:
                api.selectAll();
                break;
            case SELECTION_CHANGED:
                setSelectedStatusRights(api.getSelectedRows());
                break;
            default:
                break;
        }
    };

    return (
        <div className="nexus-c-status-log-table">
            <SelectedStatusGrid
                rowSelection="multiple"
                suppressRowClickSelection={true}
                singleClickEdit
                className="nexus-c-status-log-grid"
                rowData={selectedRights}
                columnDefs={columnDefs}
                mapping={columnMappings}
                onGridEvent={onGridReady}
            />
        </div>
    );
};

SelectedStatusTable.propTypes = {
    columnDefs: PropTypes.array.isRequired,
    selectedStatusRights: PropTypes.array,
    setSelectedStatusRights: PropTypes.func,
};

SelectedStatusTable.defaultProps = {
    selectedStatusRights: [],
    setSelectedStatusRights: () => null,
};

export default SelectedStatusTable;
