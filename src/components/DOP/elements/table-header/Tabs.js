import React, {useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import PropTypes from 'prop-types';
import {updateSelectedTerritoriesTab} from '../../../../stores/actions/DOP';
import connect from 'react-redux/es/connect/connect';
import {ALL_RIGHTS, INCOMING, PENDING_SELECTION, SELECTED} from '../../../../constants/DOP/selectedTab';
import {rightServiceManager} from '../../../../containers/avail/service/RightServiceManager';
import {tabFilter} from '../../../../constants/DOP/tabFilter';

const TabContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Tab = styled.div`
    display: inline-block;
    border-right: 1px solid #000;
    font-size: 14px;
    width: 130px;
    padding: 0 10px 0 10px;
    text-align: center;
    color: #999;
    &:hover {
        color: #666;
        cursor: pointer;
    }
    &:last-child {
        border-right: none;
        width: 200px;
    }
    ${props => props.isActive && css`
        font-weight: bold;
        font-size: 15px;
        color: #000;
    `}
    ${props => props.isDisabled && css`
        pointer-events: none;
    `}
`;

function Tabs(props) {

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
            <Tab isActive={props.selectedTerritoriesTab === ALL_RIGHTS}
                 onClick={() => props.updateFilterSelectedTerritories(ALL_RIGHTS)}>All Right ({allRightCount})</Tab>
            <Tab isActive={props.selectedTerritoriesTab === INCOMING}
                 onClick={() => props.updateFilterSelectedTerritories(INCOMING)}>Incoming ({incomingCount})</Tab>
            <Tab isActive={props.selectedTerritoriesTab === SELECTED}
                 onClick={() => props.updateFilterSelectedTerritories(SELECTED)}>Selected ({selectedCount})</Tab>
            <Tab isActive={props.selectedTerritoriesTab === PENDING_SELECTION}
                 isDisabled={props.promotedRightsCount === 0}
                 onClick={() => props.updateFilterSelectedTerritories(PENDING_SELECTION)}>Pending selection ({props.promotedRightsCount})</Tab>
        </TabContainer>
    );
}

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