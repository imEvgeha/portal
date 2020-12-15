import React from 'react';
import './NexusLayout.scss';
import {IfEmbedded} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import NexusNavigation from '../../../../../src/ui/elements/nexus-navigation/NexusNavigation';

const NexusLayout = ({children}) => (
    <div className="nexus-c-app-layout">
        <IfEmbedded>
            <DOP />
        </IfEmbedded>
        <IfEmbedded value={false}>
            <NexusNavigation />
        </IfEmbedded>
        <div className="nexus-c-app-layout__main">{children}</div>
    </div>
);

export default NexusLayout;
