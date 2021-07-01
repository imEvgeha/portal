/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
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
                <span className={person.displayNameEn &&  emetLanguage !== person?.language ? "nexus-c-nexus-person-italic": ""}>
                    {localizedName()}
                </span>
            </div>
                {emetLanguage !== 'en' &&
                <div className={person.displayNameEn &&  emetLanguage !== person?.language ? "nexus-c-nexus-person-fade": ""}>
                    {person?.displayNameEn}
                </div>}{" "}

            <div className="nexus-c-nexus-person-ro__tag">
                {person.displayName === person.displayNameEn &&  emetLanguage !== person?.language &&
                <Tooltip content="Localized name not defined"><div className="nexus-c-nexus-person-warning"/></Tooltip>}
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
