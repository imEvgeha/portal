import React, {useState} from 'react';
import './AvailsView.scss';
import IngestPanel from './ingest-panel/IngestPanel';
import RightsRepository from './rights-repository/RightsRepository';

const AvailsView = () => (
    <div className="nexus-c-avails-view">
        <IngestPanel />
        <RightsRepository />
    </div>
);

export default AvailsView;
