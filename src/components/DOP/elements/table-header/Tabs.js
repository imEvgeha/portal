import React, {useState} from 'react';
import styled, {css} from 'styled-components';
import PropTypes from 'prop-types';

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

const allRight = 'allRight';
const incoming = 'incoming';
const selected = 'selected';
const pendingSelection = 'pendingSelection';

function Tabs(props) {

    const [lastActive, setLastActive] = useState(allRight);

    const onFilterChangeClick = (activeTab) => {
        setLastActive(activeTab);
    };

    const onPendingSelectionClick = () => {
        setLastActive(pendingSelection);
    };

    return (
        <div style={{ display:'flex', alignItems: 'center'}}>
            <Tab isActive={lastActive === allRight} onClick={() => onFilterChangeClick(allRight)}>All Right ()</Tab>
            <Tab isActive={lastActive === incoming} onClick={() => onFilterChangeClick(incoming)}>Incoming ()</Tab>
            <Tab isActive={lastActive === selected} onClick={() => onFilterChangeClick(selected)}>Selected ()</Tab>
            <Tab isActive={lastActive === pendingSelection} onClick={onPendingSelectionClick}>Pending selection ()</Tab>
        </div>
    );

}

Tabs.propTypes = {
    onFilterChanged: PropTypes.func,
    updateFilterSelectedTerritories: PropTypes.func
};

export default Tabs;