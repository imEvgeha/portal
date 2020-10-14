import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {updateSelectedTerritoriesTab} from '../../../../stores/actions/DOP';
import {connect} from 'react-redux';
import {ALL_RIGHTS, INCOMING, PENDING_SELECTION, SELECTED} from '../../../../constants/DOP/selectedTab';
import {rightServiceManager} from '../../../../containers/avail/service/RightServiceManager';
import {SelectRightsTab, TabContainer} from '../../../../../../ui/elements/nexus-table-tab/TableTab';

const Tabs = ({selectedTerritoriesTab, updateFilterSelectedTerritories, promotedRightsCount, tabFilter}) => {
    const [allRightCount, setAllRightCount] = useState();
    const [incomingCount, setIncomingCount] = useState();
    const [selectedCount, setSelectedCount] = useState();

    useEffect(() => {
        rightServiceManager
            .callPlanningSearch(tabFilter[ALL_RIGHTS], 0, 1)
            .then(response => setAllRightCount(response.total));
        rightServiceManager
            .callPlanningSearch(tabFilter[INCOMING], 0, 1)
            .then(response => setIncomingCount(response.total));
        rightServiceManager
            .callPlanningSearch(tabFilter[SELECTED], 0, 1)
            .then(response => setSelectedCount(response.total));
    }, [tabFilter]);

    return (
        <TabContainer>
            <SelectRightsTab
                isActive={selectedTerritoriesTab === ALL_RIGHTS}
                onClick={() => updateFilterSelectedTerritories(ALL_RIGHTS)}
            >
                All Right ({allRightCount})
            </SelectRightsTab>
            <SelectRightsTab
                isActive={selectedTerritoriesTab === INCOMING}
                onClick={() => updateFilterSelectedTerritories(INCOMING)}
            >
                Incoming ({incomingCount})
            </SelectRightsTab>
            <SelectRightsTab
                isActive={selectedTerritoriesTab === SELECTED}
                onClick={() => updateFilterSelectedTerritories(SELECTED)}
            >
                Selected ({selectedCount})
            </SelectRightsTab>
            <SelectRightsTab
                isActive={selectedTerritoriesTab === PENDING_SELECTION}
                isDisabled={promotedRightsCount === 0}
                onClick={() => updateFilterSelectedTerritories(PENDING_SELECTION)}
            >
                Pending selection ({promotedRightsCount})
            </SelectRightsTab>
        </TabContainer>
    );
};

Tabs.propTypes = {
    selectedTerritoriesTab: PropTypes.string,
    updateFilterSelectedTerritories: PropTypes.func,
    promotedRightsCount: PropTypes.number,
};

const mapStateToProps = state => {
    return {
        selectedTerritoriesTab: state.dopReducer.session.selectedTerritoriesTab,
        promotedRightsCount: state.dopReducer.session.promotedRights.length,
        tabFilter: state.dopReducer.session.tabFilter,
    };
};

const mapDispatchToProps = {
    updateFilterSelectedTerritories: updateSelectedTerritoriesTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
