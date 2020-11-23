/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Lozenge from '@atlaskit/lozenge';
import DefaultUserIcon from '../../../assets/img/default-user.png';
import './NexusPersonRO.scss';

const NexusPersonRO = ({person}) => {
    return (
        <div className="nexus-c-nexus-person-ro">
            <div>
                <img src={DefaultUserIcon} alt="Person" className="nexus-c-nexus-person-ro__img" />
                {person.displayName}
            </div>
            <div className="nexus-c-nexus-person-ro__tag">
                <Lozenge appearance="default">{person.personType}</Lozenge>
            </div>
        </div>
    );
};

NexusPersonRO.propTypes = {
    person: PropTypes.object.isRequired,
};

export default NexusPersonRO;
