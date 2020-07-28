import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {URL} from '../../../../../util/Common';
import {SELECTED_FOR_PLANNING_TAB} from '../../constants';
import NexusTooltip from '../../../../../ui/elements/nexus-tooltip/NexusTooltip';
import DOPService from '../../DOP-services';

const SelectedForPlanningTab = ({activeTab, setActiveTab}) => {
    const [rightsCount, setRightsCount] = useState(0);

    //TODO: Resolve DOP issue
   /* useEffect(() => {
        DOPService.getUsersProjectsList(1,1).then( res => {
            setRightsCount(1);
        });
    }, [activeTab]);*/

    const setPlanning = () => {
        setActiveTab(SELECTED_FOR_PLANNING_TAB);
    };

    return (
        URL.isLocalOrDevOrQA() && (
            <NexusTooltip content='Click to refresh' isDisabled={activeTab !== SELECTED_FOR_PLANNING_TAB}>
                <div
                    className={`nexus-c-table-toolbar__title 
                        ${activeTab === SELECTED_FOR_PLANNING_TAB ? 'nexus-c-table-toolbar__title--is-active' : ''}`}
                    onClick={setPlanning}
                >
                    {SELECTED_FOR_PLANNING_TAB} ({rightsCount})
                </div>
            </NexusTooltip>
        )
    );
};

SelectedForPlanningTab.propTypes = {
    activeTab: PropTypes.bool.isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

SelectedForPlanningTab.defaultProps = {};

export default SelectedForPlanningTab;