/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import Lozenge from '@atlaskit/lozenge';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import './NexusPersonRO.scss';

const NexusPersonRO = ({person, emetLanguage}) => {

    const localizedName = () => {
        if(person?.language === 'en' && emetLanguage === 'en')
            return person.displayNameEn;
        return person.displayName === person.displayNameEn &&  emetLanguage !== person?.language ? '(Needs translation)' : person.displayName;
    }

    return (
        <div className="nexus-c-nexus-person-ro">
            <div>
                <img src={DefaultUserIcon} alt="Person" className="nexus-c-nexus-person-ro__img" />
                {localizedName()}
            </div>
                {emetLanguage !== 'en' && <div>{person?.displayNameEn}</div>}{" "}

            <div className="nexus-c-nexus-person-ro__tag">
                {person.displayName === person.displayNameEn &&  emetLanguage !== person?.language &&
                <span title="Localized name not found"><Badge appearance="removed">!</Badge></span>}
                <Lozenge appearance="default">{person.personType}</Lozenge>
            </div>
        </div>
    );
};

NexusPersonRO.propTypes = {
    person: PropTypes.object.isRequired,
    emetLanguage: PropTypes.string,
};

NexusPersonRO.defaultProps = {
    emetLanguage: "en",
};

export default NexusPersonRO;
