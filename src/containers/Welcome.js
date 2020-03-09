import React from 'react';
import NexusDrawer from '../ui-elements/nexus-drawer/NexusDrawer';
import './Welcome.scss';

const Welcome = () => (
    <div className="nexus-c-welcome">
        <h1>Nexus Portal</h1>
        <NexusDrawer
            position={'left'}
        />
    </div>
);

export default Welcome;
