import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';
import classnames from 'classnames';
import PersonCharacterItem from './PersonCharacterItem';
import './PersonCharacterContainer.scss';

const PersonCharacterContainer = ({isShown, characterName, index, onEditCharacter}) => {
    return (
        <div
            className={classnames('nexus-c-person-character-container', {
                'nexus-c-person-character-container--show': isShown,
            })}
        >
            <div className="nexus-c-person-character-container__tag">
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
    isShown: PropTypes.bool,
    characterName: PropTypes.string,
    index: PropTypes.number.isRequired,
    onEditCharacter: PropTypes.func.isRequired,
};

PersonCharacterContainer.defaultProps = {
    isShown: false,
    characterName: '',
};

export default PersonCharacterContainer;
