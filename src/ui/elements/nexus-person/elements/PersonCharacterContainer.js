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
                <PersonCharacterItem isEdit={true} onClick={() => onEditCharacter(index)}>
                    {characterName}
                </PersonCharacterItem>
            ) : (
                <Button onClick={() => onEditCharacter(index)}>Add</Button>
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
