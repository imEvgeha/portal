import React from 'react';
import PropTypes from 'prop-types';
import {ConnectedRouter} from 'connected-react-router';
import './NexusLayout.scss';
import Navigation from '../nexus-navigation/NexusNavigation';
import NexusBreadcrumb from '../../../pages/legacy/containers/NexusBreadcrumb';
import DOP from '../../../util/DOP';
import {IfEmbedded} from '../../../util/Common';
import routes from '../../../routes';

const NexusLayout = ({history}) => (
    <ConnectedRouter history={history}>
        <div className="nexus-c-app-layout">
            <IfEmbedded>
                <DOP />
            </IfEmbedded>
            <IfEmbedded value={false}>
                <Navigation />
            </IfEmbedded>
            <div className="nexus-c-app-layout__main">
                <NexusBreadcrumb />
                {routes}
            </div>
        </div>
    </ConnectedRouter>
);

export default NexusLayout;
