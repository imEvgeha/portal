/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Lozenge from '@atlaskit/lozenge';
import PersonTypeContainer from '../nexus-person/elements/PersonTypeContainer';
import './NexusPersonRO.scss';

const NexusPersonRO = ({person}) => {
    return (
        <div className="nexus-c-nexus-person-ro">
            <PersonTypeContainer personName={person.displayName} personType={person.personType} />
            {person.characterName && (
                <div className="nexus-c-nexus-person-ro__character">
                    <Lozenge appearance="default">CHARACTER</Lozenge>
                    <span>{person.characterName}</span>
                </div>
            )}
        </div>
    );
};

NexusPersonRO.propTypes = {
    person: PropTypes.object.isRequired,
};

export default NexusPersonRO;
