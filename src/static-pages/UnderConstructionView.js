import React from 'react';
import PropTypes from 'prop-types';
const UnderConstructionView = ({match}) => (
    <div className="nexus-c-under-construction-view">
        <div> UNDER CONSTRUCTION </div>
        {match && match.path}
    </div>
);

export default UnderConstructionView;
