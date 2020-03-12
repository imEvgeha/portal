import React from 'react';
import PropTypes from 'prop-types';
import {ConnectedRouter} from 'connected-react-router';
import './AppLayout.scss';
import {IfEmbedded} from './../util/Common';
import Navigation from '../navigation/NexusNavigation';
import NexusBreadcrumb from '../containers/NexusBreadcrumb';
import DOP from '../util/DOP';
import routes from '../routes';

let AppLayout = ({history}) => {
  return (
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
};

AppLayout.propTypes = {
    history: PropTypes.object,
};

AppLayout.defaultProps = {
    history: null,
};

export default AppLayout;
