import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../../../ui/elements/nexus-grid/NexusGrid';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withSideBar from '../../../../../ui/elements/nexus-grid/hoc/withSideBar';
import {COLUMN_MAPPINGS, SELECTED_FOR_PLANNING_TAB} from '../../constants';

const SelectedForPlanningTable = compose(withColumnsResizing(), withSideBar())(NexusGrid);

const SelectedForPlanning = ({activeTab}) => {
    return (
        <SelectedForPlanningTable
            id="selectedForPlanningRepo"
            columnDefs={COLUMN_MAPPINGS}
            rowSelection="multiple"
            suppressRowClickSelection
            isGridHidden={activeTab !== SELECTED_FOR_PLANNING_TAB}
        />
    );
};

SelectedForPlanning.propTypes = {
    activeTab: PropTypes.string.isRequired,
};

export default SelectedForPlanning;
