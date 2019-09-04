import React from 'react';
import PropTypes from 'prop-types';
import {ConnectedRouter} from 'connected-react-router';
import './AppLayout.scss';
import {IfEmbedded} from './../util/Common';
import Navbar from '../containers/Navbar';
import DOP from '../util/DOP';
import NexusBreadcrumb from '../containers/NexusBreadcrumb';
import routes from '../routes';

const App = ({history}) => (
    <ConnectedRouter history={history} >
        <div className="nexus-c-app-layout">
            <IfEmbedded>
                <DOP />
            </IfEmbedded>
            <IfEmbedded value={false}>
                <Navbar />
            </IfEmbedded>
            <NexusBreadcrumb />
            <div className="nexus-c-app-layout__main">
                {routes}
            </div>
         </div>
     </ConnectedRouter>
);

App.propTypes = {
    history: PropTypes.object,
};

App.defaultProps = {
    history: null,
};

export default App;
