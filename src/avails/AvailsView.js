import React, {useState} from 'react';
import IngestPanel from './ingest-panel/IngestPanel';
import RightsRepository from './rights-repository/RightsRepository';
import './AvailsView.scss';

const AvailsView = () => {

    const [selectedIngest, setSelectedIngest] = useState(null);

    const ingestClick = ingest => setSelectedIngest(ingest);

    return (
        <div className="nexus-c-avails-view">
            <IngestPanel
                ingestClick={ingestClick}
                selectedIngest={selectedIngest && selectedIngest.id}/>
            <RightsRepository selectedIngest={selectedIngest}/>
        </div>
    );
};

export default AvailsView;
