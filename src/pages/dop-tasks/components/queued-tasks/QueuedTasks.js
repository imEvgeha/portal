import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from '@portal/portal-components';
import {DOP_QUEUED_TASKS_LABEL, QUEUED_TASKS_OPTIONS} from '../../constants';
import './QueuedTasks.scss';

const QueuedTasks = ({onChange, value}) => (
    <Dropdown
        className="nexus-c-dop-tasks-queued-select"
        id="ddlTaskType"
        columnClass="col-10"
        placeholder={DOP_QUEUED_TASKS_LABEL}
        options={QUEUED_TASKS_OPTIONS}
        value={value}
        onChange={e => onChange(e.value)}
    />
);

QueuedTasks.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.object,
};

QueuedTasks.defaultProps = {
    onChange: () => null,
    value: QUEUED_TASKS_OPTIONS[0].value,
};

export default QueuedTasks;
