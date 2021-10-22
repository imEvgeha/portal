/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import {NEEDS_TRANSLATION, LOCALIZED_NOT_DEFINED} from '../nexus-persons-list/constants';
import './NexusPersonRO.scss';
import Lozenge from '@atlaskit/lozenge';
import {getDir} from '../nexus-dynamic-form/utils';
import {getFormatTypeName} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import {get} from 'lodash';

const NexusPersonRO = ({person, emetLanguage}) => {
    const localization = get(person, 'localization');
    const localizedName = () => {
        if (person?.language === 'en' && emetLanguage === 'en') return person.displayNameEn;
        return person.displayName === person.displayNameEn && emetLanguage !== person?.language
            ? NEEDS_TRANSLATION
            : person.displayName;
    };

    const hasTranslation = () => {
        return (
            localization?.some(translation => translation.language === emetLanguage) || Boolean(person?.displayNameEn)
        );
    };

    const displayName = person?.displayNameEn ? person?.displayNameEn : person?.displayName;

    return (
        <div
            className={
                hasTranslation() && emetLanguage !== 'en' && displayName
                    ? 'nexus-c-nexus-person-ro'
                    : 'nexus-c-nexus-person-ro__one-col'
            }
        >
            <div className="nexus-c-nexus-person-ro__info">
                <div>
                    <img src={DefaultUserIcon} alt="Person" className="nexus-c-nexus-person-ro__img" />
                    <div className="nexus-c-nexus-person-type">
                        <Lozenge appearance="default">{getFormatTypeName(person.personType)}</Lozenge>
                    </div>
                    <span
                        dir={getDir(localizedName())}
                        className={
                            person.displayNameEn && emetLanguage !== person?.language
                                ? 'nexus-c-nexus-person-italic'
                                : ''
                        }
                    >
                        {localizedName()}
                    </span>
                </div>
            </div>
            {hasTranslation() && emetLanguage !== 'en' && displayName && (
                <div className="nexus-c-nexus-person-ro-translation">
                    <div className="nexus-c-nexus-person-fade">
                        <span dir={getDir(displayName)}>{displayName}</span>
                    </div>
                </div>
            )}
            {person.displayName === person.displayNameEn && emetLanguage !== person?.language && (
                <div className="nexus-c-nexus-person-ro__buttons">
                    <div className="dot">
                        <Tooltip content={LOCALIZED_NOT_DEFINED}>
                            <div className="nexus-c-nexus-person-warning" />
                        </Tooltip>
                    </div>
                </div>
            )}
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
