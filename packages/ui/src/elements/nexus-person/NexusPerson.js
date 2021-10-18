/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {Draggable} from 'react-beautiful-dnd';
import {uid} from 'react-uid';
import Tooltip from '@atlaskit/tooltip';
import DefaultUserIcon from '@vubiquity-nexus/portal-assets/img/default-user.png';
import PropagateButton from './elements/PropagateButton/PropagateButton';
import DragButton from './elements/DragButton/DragButton';
import DraggableContent from './elements/DraggableContent/DraggableContent';
import RemovePerson from './elements/RemovePerson/RemovePerson';
import EditPerson from './elements/EditPerson/EditPerson';
import {NEEDS_TRANSLATION, LOCALIZED_NOT_DEFINED} from '../nexus-persons-list/constants';
import {getDir} from '../nexus-dynamic-form/utils';
import './NexusPerson.scss';
import {get} from 'lodash';
import Lozenge from '@atlaskit/lozenge';
import {getFormatTypeName} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';

const NexusPerson = ({
    person,
    index,
    onPropagate,
    onRemove,
    onEditPerson,
    emetLanguage,
    name,
    customKey,
    isTitlePage,
}) => {
    const localization = get(person, 'localization');
    const isCastCrewField = name === 'castCrew';

    const getEnName = () => {
        return localization ? person.displayName : person.displayNameEn;
    };

    const getNameFromLocalization = () => {
        const local = localization.find(l => l.language === emetLanguage);
        return local ? local.displayName : person.displayName;
    };

    const getLocalizedName = () => {
        return localization ? getNameFromLocalization() : person.displayName;
    };

    const isNeedTranslation =
        getLocalizedName() === getEnName() && person?.language !== undefined && emetLanguage !== person?.language;

    const localizedName = () => {
        if (person?.language === 'en' && emetLanguage === 'en') return getEnName();
        return isNeedTranslation ? NEEDS_TRANSLATION : getLocalizedName();
    };

    const hasTranslation = () => {
        return (
            localization?.some(translation => translation.language === emetLanguage) || Boolean(person?.displayNameEn)
        );
    };

    const displayName = person?.displayNameEn ? person?.displayNameEn : person?.displayName;

    return (
        <Draggable draggableId={customKey} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <DraggableContent isDragging={snapshot.isDragging}>
                        <div className="nexus-c-nexus-person">
                            <div className="nexus-c-nexus-person__info">
                                <div>
                                    <img src={DefaultUserIcon} alt="Person" className="nexus-c-nexus-person__img" />
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
                            <div className="nexus-c-nexus-person__translation">
                                {hasTranslation() && emetLanguage !== 'en' && (
                                    <div className="nexus-c-nexus-person-fade">
                                        <span dir={getDir(displayName)}>{displayName}</span>
                                    </div>
                                )}
                            </div>
                            <div className="nexus-c-nexus-person__buttons">
                                <div className="dot">
                                    {person.displayName === person.displayNameEn && emetLanguage !== person?.language && (
                                        <Tooltip content={LOCALIZED_NOT_DEFINED}>
                                            <div className="nexus-c-nexus-person-warning" />
                                        </Tooltip>
                                    )}
                                </div>
                                <span title="Edit">
                                    <EditPerson onClick={onEditPerson} />
                                </span>
                                <span title="Remove">
                                    <RemovePerson onClick={onRemove} />
                                </span>
                                <span title="Drag this item">
                                    <DragButton {...provided.dragHandleProps} />
                                </span>
                            </div>
                        </div>
                    </DraggableContent>
                </div>
            )}
        </Draggable>
    );
};

NexusPerson.propTypes = {
    person: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func,
    onPropagate: PropTypes.func,
    onEditPerson: PropTypes.func,
    emetLanguage: PropTypes.string,
    name: PropTypes.string,
    customKey: PropTypes.string,
    isTitlePage: PropTypes.bool,
};

NexusPerson.defaultProps = {
    onRemove: () => null,
    onPropagate: () => null,
    onEditPerson: () => null,
    emetLanguage: 'en',
    name: null,
    customKey: '',
    isTitlePage: false,
};

export default NexusPerson;
