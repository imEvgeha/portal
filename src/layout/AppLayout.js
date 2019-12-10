import React from 'react';
import PropTypes from 'prop-types';
import {ConnectedRouter} from 'connected-react-router';
import './AppLayout.scss';
import {IfEmbedded} from './../util/Common';
import Navbar from '../containers/Navbar';
import Navigation from '../navigation/NexusNavigation';
import DOP from '../util/DOP';
import NexusBreadcrumb from '../containers/NexusBreadcrumb';
import routes from '../routes';

const AppLayout = ({history}) => (
    <ConnectedRouter history={history} >
        <div className={`nexus-c-app-layout ${history.location.pathname.endsWith('/v2') ? 'nexus-navigation' : ''}`}>
            <IfEmbedded>
                <DOP />
            </IfEmbedded>
            {history.location.pathname.endsWith('/v2')
                ? (
                    <IfEmbedded value={false}>
                        <Navigation />
                    </IfEmbedded>
                )
                : (
                    <>
                        <IfEmbedded value={false}>
                            <Navbar />
                        </IfEmbedded>
                        <NexusBreadcrumb />
                    </>
                )
            }
            <div className="nexus-c-app-layout__main">
                {routes}
            </div>
         </div>
    </ConnectedRouter>
);

AppLayout.propTypes = {
    history: PropTypes.object,
};

AppLayout.defaultProps = {
    history: null,
};

export default AppLayout;
