import React from 'react';
import PropTypes from 'prop-types';
import {DOP_TASKS_HEDER} from '../../constants';
import './DopTasksHeader.scss';

const DopTasksHeader = ({label, children}) => (
    <div className="nexus-c-dop-tasks-header">
        <div className="nexus-c-dop-tasks-header__label">{label}</div>
        {children}
    </div>
);

DopTasksHeader.propTypes = {
    label: PropTypes.string,
};

DopTasksHeader.defaultProps = {
    label: DOP_TASKS_HEDER,
};

export default DopTasksHeader;
