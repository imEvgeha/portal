import React from 'react';
import PropTypes from 'prop-types';

const UnderConstructionView = ({match}) => {
    return (
        <div className="nexus-c-under-construction-view">
            <div> UNDER CONSTRUCTION </div>
            {match && match.path}
        </div>
    );
};

UnderConstructionView.propTypes = {
    match: PropTypes.object,
};

UnderConstructionView.defaultProps = {
    match: {},
};

export default UnderConstructionView;
