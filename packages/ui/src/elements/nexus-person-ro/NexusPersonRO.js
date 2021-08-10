/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import {NEEDS_TRANSLATION, LOCALIZED_NOT_DEFINED} from '../nexus-persons-list/constants';
import './NexusPersonRO.scss';
import Lozenge from '@atlaskit/lozenge';
import {getFormatTypeName} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import {PersonListFlag} from '../../../../../src/pages/legacy/containers/metadata/dashboard/components/coretitlemetadata/CustomComponents';

const NexusPersonRO = ({person, emetLanguage}) => {
    const localizedName = () => {
        if (person?.language === 'en' && emetLanguage === 'en') return person.displayNameEn;
        return person.displayName === person.displayNameEn && emetLanguage !== person?.language
            ? NEEDS_TRANSLATION
            : person.displayName;
    };

    return (
        <div className="nexus-c-nexus-person-ro">
            <div>
                <img src={DefaultUserIcon} alt="Person" className="nexus-c-nexus-person-ro__img" />
                <div className="nexus-c-nexus-person-type">
                    <Lozenge appearance="default">{getFormatTypeName(person.personType)}</Lozenge>
                </div>
                <span
                    className={
                        person.displayNameEn && emetLanguage !== person?.language ? 'nexus-c-nexus-person-italic' : ''
                    }
                >
                    {localizedName()}
                </span>
            </div>
            {emetLanguage !== 'en' && (
                <div
                    className={
                        person.displayNameEn && emetLanguage !== person?.language ? 'nexus-c-nexus-person-fade' : ''
                    }
                >
                    {person?.displayNameEn}
                </div>
            )}{' '}
            <div className="nexus-c-nexus-person-ro__tag">
                {person.displayName === person.displayNameEn && emetLanguage !== person?.language && (
                    <Tooltip content={LOCALIZED_NOT_DEFINED}>
                        <div className="nexus-c-nexus-person-warning" />
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

NexusPersonRO.propTypes = {
    person: PropTypes.object.isRequired,
    emetLanguage: PropTypes.string,
};

NexusPersonRO.defaultProps = {
    emetLanguage: 'en',
};

export default NexusPersonRO;
