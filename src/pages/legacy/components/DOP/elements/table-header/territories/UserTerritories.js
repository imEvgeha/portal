import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import {DeleteButton, TerritoryTag} from './TerritoryItem';
import styled from 'styled-components';
import {colors} from '@atlaskit/theme';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import ToggleButton from 'react-toggle-button';
import UserTerritoriesModal from './UserTerritoriesModal';
import {connect} from 'react-redux';
import {updateSelectedTerritories, updateUseSelectedTerritories} from '../../../../../stores/actions/DOP';

const IconExplorerLink = styled.a`
    &,
    &:hover,
    &:active,
    &:focus {
        border-radius: 5px;
        color: inherit;
        cursor: pointer;
        display: block;
        line-height: 0;
        padding: 10px;
    }

    &:hover {
        background: ${colors.N30A};
    }
`;

const UserTerritories = props => {
    const [userTerritoriesModalOpen, setUserTerritoriesModalOpen] = useState(false);

    const toggleModal = () => {
        setUserTerritoriesModalOpen(!userTerritoriesModalOpen);
    };

    const onRemoveSelectedTerritory = territory => {
        const filteredTerritories = props.selectedTerritories.filter(el => el.id !== territory.id);
        props.updateSelectedTerritories(filteredTerritories);
    };

    return (
        <div id="selectedUserTerritories" style={{display: 'flex', alignItems: 'center', verticalAlign: 'middle'}}>
            <Popup
                style={{width: '250px', border: ' 2px solid red'}}
                trigger={<span>User Territories: </span>}
                position="bottom center"
                on="hover"
            >
                <div style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: '2px', marginBottom: '2px'}}>
                    {props.selectedTerritories.map((e, index) => {
                        return (
                            <TerritoryTag key={index}>
                                {e.countryName}{' '}
                                <DeleteButton onClick={() => onRemoveSelectedTerritory(e)}>&times;</DeleteButton>{' '}
                            </TerritoryTag>
                        );
                    })}
                </div>
            </Popup>
            <IconExplorerLink onClick={toggleModal}>
                <ShortcutIcon size="small" />
            </IconExplorerLink>
            <ToggleButton
                value={props.useSelectedTerritories}
                onToggle={useSelectedTerritories => props.updateUseSelectedTerritories(!useSelectedTerritories)}
            />

            <UserTerritoriesModal isOpen={userTerritoriesModalOpen} toggle={toggleModal} />
        </div>
    );
};

UserTerritories.propTypes = {
    selectedTerritories: PropTypes.array,
    useSelectedTerritories: PropTypes.bool,
    updateUseSelectedTerritories: PropTypes.func,
    updateSelectedTerritories: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectedTerritories: state.dopReducer.session.selectedTerritories,
        useSelectedTerritories: state.dopReducer.session.useSelectedTerritories,
    };
};

const mapDispatchToProps = {
    updateUseSelectedTerritories,
    updateSelectedTerritories,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserTerritories);
