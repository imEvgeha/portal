import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';
import PersonCharacterItem from './PersonCharacterItem';
import './PersonCharacterContainer.scss';

const PersonCharacterContainer = ({characterName, index, onEditCharacter}) => {
    return (
        <div className="nexus-c-person-character-container">
            <div>
                <Lozenge appearance="default">CHARACTER</Lozenge>
            </div>
            {characterName ? (
                <PersonCharacterItem isEdit={true} index={index} onClick={onEditCharacter}>
                    {characterName}
                </PersonCharacterItem>
            ) : (
                <div className="nexus-c-person-character-container__add" onClick={() => onEditCharacter(index)}>
                    +Add
                </div>
            )}
        </div>
    );
};

PersonCharacterContainer.propTypes = {
    characterName: PropTypes.string,
    index: PropTypes.number.isRequired,
    onEditCharacter: PropTypes.func.isRequired,
};

PersonCharacterContainer.defaultProps = {
    characterName: '',
};

export default PersonCharacterContainer;
