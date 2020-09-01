import React from 'react';
import PropTypes from 'prop-types';
import config from 'react-global-configuration';
import {compose} from 'redux';
import NexusGrid from '../../../../../ui/elements/nexus-grid/NexusGrid';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withInfiniteScrolling from '../../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../../ui/elements/nexus-grid/hoc/withSideBar';
import {COLUMN_MAPPINGS, DOP_PROJECT_URL, SELECTED_FOR_PLANNING_TAB} from '../../constants';
import {prepareSelectForPlanningData} from './utils';

const SelectedForPlanningTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withInfiniteScrolling({fetchData: prepareSelectForPlanningData})
)(NexusGrid);

const SelectedForPlanning = ({activeTab, isPlanningTabRefreshed}) => {
    const mappings = COLUMN_MAPPINGS.map(col =>
        col.colId === 'projectId'
            ? {
                  ...col,
                  cellRendererParams: {
                      link: `${config.get('gateway.DOPUrl')}${DOP_PROJECT_URL}`,
                  },
              }
            : col
    );
    return (
        <SelectedForPlanningTable
            id="selectedForPlanningRepo"
            columnDefs={mappings}
            rowSelection="multiple"
            suppressRowClickSelection
            isGridHidden={activeTab !== SELECTED_FOR_PLANNING_TAB}
            key={`planning_table_${isPlanningTabRefreshed}`}
        />
    );
};

SelectedForPlanning.propTypes = {
    activeTab: PropTypes.string.isRequired,
    isPlanningTabRefreshed: PropTypes.bool.isRequired,
};

export default SelectedForPlanning;
