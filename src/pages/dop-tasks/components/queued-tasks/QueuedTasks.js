import React from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import {DOP_QUEUED_TASKS_LABEL, QUEUED_TASKS_OPTIONS} from '../../constants';
import './QueuedTasks.scss';

const QueuedTasks = ({setUser, selectedValue}) => (
    <Select
        className="nexus-c-dop-tasks-queued-select"
        classNamePrefix="nexus-select"
        value={selectedValue}
        options={QUEUED_TASKS_OPTIONS}
        defaultValue={QUEUED_TASKS_OPTIONS[0]}
        placeholder={DOP_QUEUED_TASKS_LABEL}
        onChange={val => setUser(val.value)}
    />
);

QueuedTasks.propTypes = {
    setUser: PropTypes.func,
    selectedValue: PropTypes.object,
};

QueuedTasks.defaultProps = {
    setUser: () => null,
    selectedValue: QUEUED_TASKS_OPTIONS[0],
};

export default QueuedTasks;
