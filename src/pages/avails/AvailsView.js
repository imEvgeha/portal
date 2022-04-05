import React, {useState} from 'react';
import IngestPanel from './ingest-panel/IngestPanel';
import RightsRepository from './rights-repository/RightsRepository';
import './AvailsView.scss';

const AvailsView = () => {
    const [isTableDataLoading, setIsTableDataLoading] = useState(false);
    return (
        <div className="nexus-c-avails-view">
            <IngestPanel isTableDataLoading={isTableDataLoading} />
            <RightsRepository setIsTableDataLoading={setIsTableDataLoading} isTableDataLoading={isTableDataLoading} />
        </div>
    );
};

export default AvailsView;
