import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ChevronDown from '@vubiquity-nexus/portal-assets/icon-nav-chevron-down-black.svg';
import ChevronUp from '@vubiquity-nexus/portal-assets/icon-nav-chevron-up-black.svg';
import {Divider} from 'primereact/divider';
import FieldRequired from '../nexus-field-required/FieldRequired';
import {Action} from './entity-actions/Actions.class';
import EntityActions from './entity-actions/EntityActions';
import './NexusEntity.scss';
import {NEXUS_ENTITY_TYPES} from './constants';

// Actions Usage:
// const actions = [
//     new Action({
//         icon: File,
//         action: () => {
//             console.log('icon clicked');
//         },
//         position: 4,
//         disabled: false,
//         buttonId: 'fileBtn',
//     }),
// ];

const NexusEntity = ({type, heading, tag, flag1, flag2, actions, disableHover, isActive, body, isRequired}) => {
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isBodyExpanded, setIsBodyExpanded] = useState(false);

    const getActions = () => {
        if (body) {
            const expandAction = new Action({
                icon: isBodyExpanded ? ChevronDown : ChevronUp,
                action: e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsBodyExpanded(!isBodyExpanded);
                },
                position: 4,
                disabled: false,
                buttonId: 'btnEditConfig',
            });

            const newActions = [];
            let actionFound = false;
            actions.forEach(a => {
                if (a.position === 6) {
                    actionFound = true;
                    newActions.push(expandAction);
                }
                newActions.push(a);
            });
            !actionFound && newActions.push(expandAction);

            return newActions;
        }
        return actions;
    };

    const divider = () =>
        type === NEXUS_ENTITY_TYPES.default ? (
            <div className="px-1">
                <Divider className="m-0" />
            </div>
        ) : null;

    const newActions = getActions();
    const hasActions = (Array.isArray(newActions) && newActions.length > 0) || !!tag || !!flag1 || !!flag2;
    return (
        <div className="nexus-c-entity row">
            <div className="col-12">
                {divider()}
                <div
                    className={`nexus-c-entity-panel row ${isActive ? 'nexus-c-entity-active' : ''} ${
                        type === NEXUS_ENTITY_TYPES.default ? 'nexus-c-row-entity' : ''
                    }`}
                    onMouseEnter={() => setIsMouseOver(true)}
                    onMouseLeave={() => setIsMouseOver(false)}
                >
                    <div className="col-12">
                        <div className={`row nexus-c-section align-items-center nexus-c-section-${type}`}>
                            <div
                                className={`col-12 nexus-c-heading text-center text-sm-start ${
                                    hasActions ? 'col-sm-6' : 'col-sm-12'
                                }`}
                            >
                                {heading}
                                <FieldRequired required={!!isRequired} />
                            </div>
                            {hasActions && (
                                <div className="col-12 text-center text-sm-start col-sm-6">
                                    <EntityActions
                                        actions={newActions}
                                        tag={tag}
                                        flag1={flag1}
                                        flag2={flag2}
                                        totalEnabled={disableHover ? true : isMouseOver}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {divider()}

                {!!body && isBodyExpanded && <div className="nexus-c-entity-body px-4 pt-4 pb-1">{body}</div>}
                {!!body && isBodyExpanded && divider()}
            </div>
        </div>
    );
};

NexusEntity.propTypes = {
    type: PropTypes.string,
    heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    tag: PropTypes.string || PropTypes.element,
    flag1: PropTypes.string || PropTypes.element,
    flag2: PropTypes.string || PropTypes.element,
    actions: PropTypes.array,
    disableHover: PropTypes.bool,
    isActive: PropTypes.bool,
    body: PropTypes.element,
    isRequired: PropTypes.bool,
};

NexusEntity.defaultProps = {
    type: NEXUS_ENTITY_TYPES.default,
    heading: '',
    tag: '',
    flag1: '',
    flag2: '',
    actions: [],
    disableHover: false,
    isActive: false,
    body: undefined,
    isRequired: false,
};

export default NexusEntity;
