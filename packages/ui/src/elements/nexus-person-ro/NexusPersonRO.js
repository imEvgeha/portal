/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Lozenge from '@atlaskit/lozenge';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import './NexusPersonRO.scss';

const NexusPersonRO = ({person}) => {

    const localizedName = () => {
        if(person?.language === 'en')
            return person.displayNameEn;
        return person.displayName === person.displayNameEn ? '(Needs translation)' : person.displayName;
    }

    return (
        <div className="nexus-c-nexus-person-ro">
            <div>
                <img src={DefaultUserIcon} alt="Person" className="nexus-c-nexus-person-ro__img" />
                {localizedName()}
            </div>
            {person?.language !== 'en' && <div>{person?.displayNameEn}</div>}
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
