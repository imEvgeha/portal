import React from 'react';
import PropTypes from 'prop-types';
import IngestPanel from './ingest-panel/IngestPanel';
import RightsRepository from './rights-repository/RightsRepository';
import './AvailsView.scss';

const AvailsView = ({location}) => (
    <div className="nexus-c-avails-view">
        <IngestPanel />
        <RightsRepository location={location} />
    </div>
);

AvailsView.propTypes = {
    location: PropTypes.object,
};

AvailsView.defaultProps = {
    location: {},
};

export default AvailsView;
