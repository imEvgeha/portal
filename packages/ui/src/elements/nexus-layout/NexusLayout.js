import React from 'react';
import {IfEmbedded} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {Outlet} from 'react-router-dom';
import NexusNavigation from '../nexus-navigation/NexusNavigation';
import './NexusLayout.scss';

const NexusLayout = ({children}) => (
    <div className="nexus-c-app-layout">
        <IfEmbedded>
            <DOP />
        </IfEmbedded>
        <IfEmbedded value={false}>
            <NexusNavigation />
        </IfEmbedded>
        <div className="nexus-c-app-layout__main">
            <Outlet />
        </div>
    </div>
);

export default NexusLayout;
