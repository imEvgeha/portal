import React from 'react';
import PropTypes from 'prop-types';
import {ConnectedRouter} from 'connected-react-router';
import './AppLayout.scss';
import {IfEmbedded} from './../util/Common';
import Navigation from '../navigation/NexusNavigation';
import NexusBreadcrumb from '../containers/NexusBreadcrumb';
import DOP from '../util/DOP';
import routes from '../routes';
import connect from 'react-redux/lib/connect/connect';

const AppLayout = ({history, pathname}) => (
    <ConnectedRouter history={history} >
        <div className="nexus-c-app-layout">
            <IfEmbedded>
                <DOP />
            </IfEmbedded>
            <IfEmbedded value={false}>
                <Navigation />
            </IfEmbedded>
            <div className="nexus-c-app-layout__main">
                {pathname !== '/avails/v2' && <NexusBreadcrumb/>}
                {routes}
            </div>
         </div>
    </ConnectedRouter>
);

AppLayout.propTypes = {
    history: PropTypes.object,
    pathname: PropTypes.string
};

AppLayout.defaultProps = {
    history: null,
    pathname: ''
};


const mapStateToProps = state => {
    return { pathname: state.router.location.pathname };
};

export default connect(mapStateToProps)(AppLayout);
