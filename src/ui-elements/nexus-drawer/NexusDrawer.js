import React, {Fragment, useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {NexusOverlayContext} from '../nexus-overlay/NexusOverlay';

import './NexusDrawer.scss';

const NexusDrawer = ({
    position,
    isOpen,
}) => {
    const {setIsOverlayActive} = useContext(NexusOverlayContext);
    useEffect(() => setIsOverlayActive(isOpen), [isOpen]);

    const openClass = isOpen ? 'nexus-c-drawer--is-open' : '';

    return (
        <div className={`nexus-c-drawer nexus-c-drawer--is-${position} ${openClass} nexus-c-drawer--is-medium-width`}>
            brtthaoeu
            <button onClick={() => setIsOverlayActive(true)}> brttt </button>
        </div>
    );
};

NexusDrawer.propTypes = {
    position: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
};

NexusDrawer.defaultProps = {
    position: 'right',
};

export default NexusDrawer;
