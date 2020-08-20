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
import {prepareSelectForPlanningData} from './utils';

const SelectedForPlanningTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withInfiniteScrolling({fetchData: prepareSelectForPlanningData})
)(NexusGrid);

const SelectedForPlanning = ({activeTab, isPlanningTabRefreshed}) => {
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
            key={`planning_table_${isPlanningTabRefreshed}`}
        />
    );
};

SelectedForPlanning.propTypes = {
    activeTab: PropTypes.string.isRequired,
    isPlanningTabRefreshed: PropTypes.bool.isRequired,
};

export default SelectedForPlanning;
