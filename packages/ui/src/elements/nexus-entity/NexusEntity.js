import React from 'react';
import PropTypes from 'prop-types';
import EntityActions from './entity-actions/EntityActions';

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

const NexusEntity = ({heading, tag, flag1, flag2, actions}) => {
    return (
        <div className="nexus-c-entity container-fluid">
            <div className="row nexus-c-section align-items-center">
                <div className="col-12 text-center text-sm-start col-sm-6">{heading}</div>
                <div className="col-12 text-center text-sm-start col-sm-6">
                    <EntityActions actions={actions} tag={tag} flag1={flag1} flag2={flag2} />
                </div>
            </div>
        </div>
    );
};

NexusEntity.propTypes = {
    heading: PropTypes.element,
    tag: PropTypes.string || PropTypes.element,
    flag1: PropTypes.string || PropTypes.element,
    flag2: PropTypes.string || PropTypes.element,
    actions: PropTypes.array,
};

NexusEntity.defaultProps = {
    heading: <span />,
    tag: '',
    flag1: '',
    flag2: '',
    actions: [],
};

export default NexusEntity;
