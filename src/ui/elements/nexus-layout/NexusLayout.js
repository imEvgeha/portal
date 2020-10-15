import React from 'react';
import './NexusLayout.scss';
import {IfEmbedded} from '../../../util/Common';
import DOP from '../../../util/DOP';
import NexusNavigation from '../nexus-navigation/NexusNavigation';

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
