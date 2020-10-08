import React from 'react';
import PropTypes from 'prop-types';
import './DopTasksTableStatusBar.scss';

const DopTasksTableStatusBar = ({paginationData}) => {
    return (
        <div className="nexus-c-dop-tasks-table-status-bar">
            <span className="nexus-c-dop-tasks-table-status-bar__description">
                Rows:{' '}
                <span className="nexus-c-dop-tasks-table-status-bar__value">
                    {paginationData.pageSize} of {paginationData.totalCount}
                </span>
            </span>
        </div>
    );
};

DopTasksTableStatusBar.propTypes = {
    paginationData: PropTypes.object,
};

DopTasksTableStatusBar.defaultProps = {
    paginationData: {
        pageSize: 0,
        totalCount: 0,
    },
};

export default DopTasksTableStatusBar;
