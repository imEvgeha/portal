import React, {useState} from 'react';
import PropTypes from 'prop-types';
import IngestPanel from './ingest-panel/IngestPanel';
import RightsRepository from './rights-repository/RightsRepository';
import './AvailsView.scss';

const AvailsView = ({location}) => {
    const [isTableDataLoading, setIsTableDataLoading] = useState(false);
    return (
        <div className="nexus-c-avails-view">
            <IngestPanel isTableDataLoading={isTableDataLoading} />
            <RightsRepository
                setIsTableDataLoading={setIsTableDataLoading}
                isTableDataLoading={isTableDataLoading}
                location={location}
            />
        </div>
    );
};

AvailsView.propTypes = {
    location: PropTypes.object,
};

AvailsView.defaultProps = {
    location: {},
};

export default AvailsView;
