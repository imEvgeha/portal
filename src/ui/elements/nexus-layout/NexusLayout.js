import React from 'react';
import PropTypes from 'prop-types';
import './NexusLayout.scss';
import NexusNavigation from '../nexus-navigation/NexusNavigation';
import DOP from '../../../util/DOP';
import {IfEmbedded} from '../../../util/Common';

const NexusLayout = ({children}) => (
    <div className="nexus-c-app-layout">
        <IfEmbedded>
            <DOP />
        </IfEmbedded>
        <IfEmbedded value={false}>
            <NexusNavigation />
        </IfEmbedded>
        <div className="nexus-c-app-layout__main">
            {children}
        </div>
    </div>
);

export default NexusLayout;
