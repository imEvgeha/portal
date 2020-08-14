import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../../../ui/elements/nexus-grid/NexusGrid';
import ClickableCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/clickable-cell-renderer/ClickableCellRenderer';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withInfiniteScrolling from '../../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../../ui/elements/nexus-grid/hoc/withSideBar';
import DOPService from '../../DOP-services';
import {COLUMN_MAPPINGS, SELECTED_FOR_PLANNING_TAB} from '../../constants';

const prepareSelectForPlanningData = async (sort, offset, limit) => {
    // Using object for easier parsing of getProjectAttributes response
    let data = {};

    // Fetch all active projects for the current user
    // N.B. offset + 1 because DOP API starts counting pages from 1
    //      while the rest of the APIs start from 0
    const [projectsList, headers]  = await DOPService.getUsersProjectsList(offset + 1, 1);
    const projectIds = [];

    // Extract project IDs for incomplete projects to display in SelectForPlanning table
    // TODO: Use projectsList when BE defect is fixed
    [{id: 'Project8680', status: 'CIN PROGRESS'}, {id: 'Project8679', status: 'CIN PROGRESS'}].forEach(({id, status}) => {
        if (!['COMPLETED', 'CANCELLED'].includes(status)) {
            projectIds.push(id);
            data[id] = {status};
        }
    });

    // Fetch project data and build rowData for ag-grid
    const projectAttributes = await DOPService.getProjectAttributes(projectIds);

    projectAttributes.forEach(({code, value, projectId}) => {
        // Filter out unwanted fields
        if (!['PROJECT_NAME'].includes(code)) {
            data[projectId][code] = value;
            // Adding projectId to be used for starting DOP project
            // in cellRenderer's onClick
            data[projectId]['projectId'] = projectId;
        }
    });

    // Convert object to an array
    data = Object.values(data);
    const total = headers.get('X-Total-Count') && data.length;

    return new Promise(res => {
        res({
            page: offset,
            size: limit,
            total,
            data,
        });
    });
};

const SelectedForPlanningTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withInfiniteScrolling({fetchData: prepareSelectForPlanningData})
)(NexusGrid);

const SelectedForPlanning = ({activeTab}) => {
    const updatedColumnDefs = COLUMN_MAPPINGS.map(mapping => {
        // Attaching cellRenderer and action to status field
        // as it's used for starting DOP project
        if (mapping.field === 'status') {
            return {
                ...mapping,
                cellRenderer: 'clickableCellRenderer',
                cellRendererParams: {
                    onClick: DOPService.startProject,
                    keyToDisplay: 'status',
                },
            };
        }

        return mapping;
    });

    return (
        <SelectedForPlanningTable
            id="selectedForPlanningRepo"
            columnDefs={updatedColumnDefs}
            rowSelection="multiple"
            suppressRowClickSelection
            isGridHidden={activeTab !== SELECTED_FOR_PLANNING_TAB}
            frameworkComponents={{
                clickableCellRenderer: ClickableCellRenderer,
            }}
        />
    );
};

SelectedForPlanning.propTypes = {
    activeTab: PropTypes.string.isRequired,
};

export default SelectedForPlanning;
