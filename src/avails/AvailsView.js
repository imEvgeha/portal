import React, {useState} from 'react';
import IngestPanel from './ingest-panel/IngestPanel';
import RightsRepository from './rights-repository/RightsRepository';
import './AvailsView.scss';

const AvailsView = () => {

    return (
        <div className="nexus-c-avails-view">
            <IngestPanel />
            <RightsRepository />
        </div>
    );
};

export default AvailsView;
