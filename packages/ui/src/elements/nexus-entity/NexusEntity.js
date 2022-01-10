import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EntityActions from './entity-actions/EntityActions';
import './NexusEntity.scss';
import { NEXUS_ENTITY_TYPES } from './constants';

// Actions Usage:
// const actions = [
//     new Action({
//         icon: File,
//         action: () => {
//             console.log('icon clicked');
//         },
//         position: 6,
//         disabled: false,
//         buttonId: 'fileBtn',
//     }),
// ];

const NexusEntity = ({type, heading, tag, flag1, flag2, actions, disableHover}) => {
    const [isMouseOver, setIsMouseOver] = useState(false);

    return (
        <div className='nexus-c-entity container-fluid nexus-c-entity' onMouseEnter={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)}>
            <div className={`row nexus-c-section align-items-center nexus-c-section-${type}`}>
                <div className="col-12 nexus-c-heading text-center text-sm-start col-sm-6">{heading}</div>
                <div className="col-12 text-center text-sm-start col-sm-6">
                    <EntityActions actions={actions} tag={tag} flag1={flag1} flag2={flag2} totalEnabled={disableHover ? true : isMouseOver} />
                </div>
            </div>
        </div>
    );
};

NexusEntity.propTypes = {
    type: PropTypes.string,
    heading: PropTypes.element,
    tag: PropTypes.string || PropTypes.element,
    flag1: PropTypes.string || PropTypes.element,
    flag2: PropTypes.string || PropTypes.element,
    actions: PropTypes.array,
    disableHover: PropTypes.bool,
};

NexusEntity.defaultProps = {
    type: NEXUS_ENTITY_TYPES.default,
    heading: <span />,
    tag: '',
    flag1: '',
    flag2: '',
    actions: [],
    disableHover: false,
};

export default NexusEntity;
