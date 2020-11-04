import React from 'react';
import PropTypes from 'prop-types';
import './BulkDeleteAffectedRights.scss';

const BulkDeleteAffectedRights = ({rightsWithDeps}) => {
    return (
        <div className="nexus-c-bulk-delete-affected-rights">
            <p>test</p>
        </div>
    );
};

BulkDeleteAffectedRights.propTypes = {
    rightsWithDeps: PropTypes.object,
};

BulkDeleteAffectedRights.defaultProps = {
    rightsWithDeps: {},
};

export default BulkDeleteAffectedRights;
