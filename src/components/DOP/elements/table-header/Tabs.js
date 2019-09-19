import React from 'react';
import styled, {css} from 'styled-components';
import PropTypes from 'prop-types';
import {updateSelectedTerritoriesTab} from '../../../../stores/actions/DOP';
import connect from 'react-redux/es/connect/connect';
import {ALL_RIGHT, INCOMING, PENDING_SELECTION, SELECTED} from '../../../../constants/DOP/selectedTab';

const TabContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Tab = styled.div`
    display: inline-block;
    border-right: 1px solid #000;
    font-size: 14px;
    width: 110px;
    padding: 0 10px 0 10px;
    text-align: center;
    color: #999;
    &:hover {
        color: #666;
        cursor: pointer;
    }
    &:last-child {
        border-right: none;
        width: 170px;
    }
    ${props => props.isActive && css`
        font-weight: bold;
        font-size: 15px;
        color: #000;
    `}
`;

function Tabs(props) {

    return (
        <TabContainer>
            <Tab isActive={props.selectedTerritoriesTab === ALL_RIGHT}
                 onClick={() => props.updateFilterSelectedTerritories(ALL_RIGHT)}>All Right ()</Tab>
            <Tab isActive={props.selectedTerritoriesTab === INCOMING}
                 onClick={() => props.updateFilterSelectedTerritories(INCOMING)}>Incoming ()</Tab>
            <Tab isActive={props.selectedTerritoriesTab === SELECTED}
                 onClick={() => props.updateFilterSelectedTerritories(SELECTED)}>Selected ()</Tab>
            <Tab isActive={props.selectedTerritoriesTab === PENDING_SELECTION}
                 onClick={() => props.updateFilterSelectedTerritories(PENDING_SELECTION)}>Pending selection ()</Tab>
        </TabContainer>
    );

}

Tabs.propTypes = {
    selectedTerritoriesTab: PropTypes.string,
    updateFilterSelectedTerritories: PropTypes.func
};

const mapStateToProps = state => {
    return {
        selectedTerritoriesTab: state.dopReducer.session.selectedTerritoriesTab,
    };
};

const mapDispatchToProps = {
    updateFilterSelectedTerritories: updateSelectedTerritoriesTab
};

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);