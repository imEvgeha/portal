import React from 'react';
import PropTypes from 'prop-types';
import './DopTasksTableStatusBar.scss';

const DopTasksTableStatusBar = ({statusBarInfo}) => {
    return (
        <div className="nexus-c-dop-tasks-table-status-bar">
            <span className="nexus-c-dop-tasks-table-status-bar__description">
                Rows: <span className="nexus-c-dop-tasks-table-status-bar__value">10 of 225</span>
            </span>
        </div>
    );
};

DopTasksTableStatusBar.propTypes = {
    statusBarInfo: PropTypes.object,
};

DopTasksTableStatusBar.defaultProps = {
    statusBarInfo: {},
};

export default DopTasksTableStatusBar;
