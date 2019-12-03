import React from 'react';
import PropTypes from 'prop-types';
import {ConnectedRouter} from 'connected-react-router';
// import {LayoutManager, NavigationProvider} from '@atlaskit/navigation-next';
import './AppLayout.scss';
import {IfEmbedded} from './../util/Common';
import Navbar from '../containers/Navbar';
import Navigation from '../navigation/NexusNavigation';
import DOP from '../util/DOP';
import NexusBreadcrumb from '../containers/NexusBreadcrumb';
import routes from '../routes';

const AppLayout = ({history}) => (
    <ConnectedRouter history={history} >
        {/*TODO: Uncomment this and remove the conditional Navbar render below when fully switched to new navigation*/}
        {/*<NavigationProvider>*/}
        {/*    <LayoutManager*/}
        {/*        globalNavigation={() => <Navigation/>}*/}
        {/*        productNavigation={() => null}*/}
        {/*        containerNavigation={() => null}*/}
        {/*    >*/}
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
            {/*</LayoutManager>*/}
        {/*</NavigationProvider>*/}
    </ConnectedRouter>
);

AppLayout.propTypes = {
    history: PropTypes.object,
};

AppLayout.defaultProps = {
    history: null,
};

export default AppLayout;
