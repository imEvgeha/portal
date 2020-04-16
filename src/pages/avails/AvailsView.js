import React, {useState} from 'react';
import './AvailsView.scss';
import IngestPanel from './ingest-panel/IngestPanel';
import RightsRepository from './rights-repository/RightsRepository';
// const IngestPanel = React.lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "Ingest" */'./ingest-panel/IngestPanel'));

const AvailsView = ({location}) => {
  return (
      <div className="nexus-c-avails-view">
          <IngestPanel />
          <RightsRepository location={location} />
      </div>
);
};

export default AvailsView;
