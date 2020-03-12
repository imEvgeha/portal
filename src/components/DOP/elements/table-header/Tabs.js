import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {updateSelectedTerritoriesTab} from '../../../../stores/actions/DOP';
import {connect} from 'react-redux';
import {ALL_RIGHTS, INCOMING, PENDING_SELECTION, SELECTED} from '../../../../constants/DOP/selectedTab';
import {rightServiceManager} from '../../../../containers/avail/service/RightServiceManager';
import {tabFilter} from '../../../../constants/DOP/tabFilter';
import {SelectRightsTab, TabContainer} from '../../../../ui-elements/nexus-table-tab/TableTab';

let Tabs = (props) => {

    const [allRightCount, setAllRightCount] = useState();
    const [incomingCount, setIncomingCount] = useState();
    const [selectedCount, setSelectedCount] = useState();

    useEffect(() => {
        rightServiceManager.callPlanningSearch(tabFilter.get(ALL_RIGHTS), 0, 1)
            .then(response => setAllRightCount(response.data.total));
        rightServiceManager.callPlanningSearch(tabFilter.get(INCOMING), 0, 1)
            .then(response => setIncomingCount(response.data.total));
        rightServiceManager.callPlanningSearch(tabFilter.get(SELECTED), 0, 1)
            .then(response => setSelectedCount(response.data.total));
    }, []);

    return (
        <TabContainer>
            <SelectRightsTab
                isActive={props.selectedTerritoriesTab === ALL_RIGHTS}
                onClick={() => props.updateFilterSelectedTerritories(ALL_RIGHTS)}
            >All Right ({allRightCount})
            </SelectRightsTab>
            <SelectRightsTab
                isActive={props.selectedTerritoriesTab === INCOMING}
                onClick={() => props.updateFilterSelectedTerritories(INCOMING)}
            >Incoming ({incomingCount})
            </SelectRightsTab>
            <SelectRightsTab
                isActive={props.selectedTerritoriesTab === SELECTED}
                onClick={() => props.updateFilterSelectedTerritories(SELECTED)}
            >Selected ({selectedCount})
            </SelectRightsTab>
            <SelectRightsTab
                isActive={props.selectedTerritoriesTab === PENDING_SELECTION}
                isDisabled={props.promotedRightsCount === 0}
                onClick={() => props.updateFilterSelectedTerritories(PENDING_SELECTION)}
            >Pending selection ({props.promotedRightsCount})
            </SelectRightsTab>
        </TabContainer>
    );
};

Tabs.propTypes = {
    selectedTerritoriesTab: PropTypes.string,
    updateFilterSelectedTerritories: PropTypes.func,
    promotedRightsCount: PropTypes.number
};

const mapStateToProps = state => {
    return {
        selectedTerritoriesTab: state.dopReducer.session.selectedTerritoriesTab,
        promotedRightsCount: state.dopReducer.session.promotedRights.length,
    };
};

const mapDispatchToProps = {
    updateFilterSelectedTerritories: updateSelectedTerritoriesTab
};

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);