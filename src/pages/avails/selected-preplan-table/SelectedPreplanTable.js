import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {isEmpty} from 'lodash';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';

const SelectedPreplanGrid = compose(withColumnsResizing(), withSideBar(), withEditableColumns())(NexusGrid);

const SelectedPreplanTable = ({
    columnDefs,
    mapping,
    selectedGridApi,
    setSelectedGridApi,
    selectedColumnApi,
    setSelectedColumnApi,
    selectedRepoRights,
    selectedRights,
    username,
    setSelectedPrePlanRights,
}) => {
    const [currentUserSelectedRights, setCurrentUserSelectedRights] = useState([]);

    useEffect(() => {
        if (!isEmpty(selectedRights) && username && selectedGridApi) {
            setCurrentUserSelectedRights(Object.values(selectedRights));
        }

        if (!isEmpty(selectedRights) && username && currentUserSelectedRights && selectedGridApi?.forEachNode) {
            selectedGridApi.forEachNode(node => node?.setSelected(true));
        }
    }, [selectedGridApi]);

    const onSelectedRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, SELECTION_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;

        switch (type) {
            case FIRST_DATA_RENDERED:
                !selectedGridApi && setSelectedGridApi(api);
                !selectedColumnApi && setSelectedColumnApi(columnApi);

                if (api && api?.forEachNode) {
                    api.forEachNode(node => node?.setSelected(true));
                }

                break;
            case READY:
                !selectedGridApi && setSelectedGridApi(api);
                !selectedColumnApi && setSelectedColumnApi(columnApi);

                if (api && api?.forEachNode) {
                    api.forEachNode(node => node?.setSelected(true));
                }
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

                if (nodesToDeselect) {
                    nodesToDeselect.forEach(node => node?.setSelected(false));
                }

                setSelectedPrePlanRights(api.getSelectedRows());
                break;
            }
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
            setSelectedColumnApi={setSelectedColumnApi}
            setSelectedGridApi={setSelectedGridApi}
        />
    );
};

SelectedPreplanTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    selectedRepoRights: PropTypes.array,
    selectedGridApi: PropTypes.object,
    setSelectedGridApi: PropTypes.func,
    selectedColumnApi: PropTypes.object,
    setSelectedColumnApi: PropTypes.func,
    selectedRights: PropTypes.array,
    username: PropTypes.string,
    setSelectedPrePlanRights: PropTypes.func.isRequired,
};

SelectedPreplanTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    selectedRepoRights: [],
    selectedGridApi: {},
    setSelectedGridApi: () => null,
    selectedColumnApi: {},
    setSelectedColumnApi: () => null,
    selectedRights: [],
    username: {},
};

export default SelectedPreplanTable;
