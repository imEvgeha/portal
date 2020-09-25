import React from 'react';
import Select from '@atlaskit/select';
import {DOP_QUEUED_TASKS_LABEL, QUEUED_TASKS_OPTIONS} from '../../constants';
import './QueuedTasks.scss';

const QueuedTasks = () => (
    <Select
        className="nexus-c-dop-tasks-queued-select"
        classNamePrefix="nexus-select"
        options={QUEUED_TASKS_OPTIONS}
        defaultValue={QUEUED_TASKS_OPTIONS[0]}
        placeholder={DOP_QUEUED_TASKS_LABEL}
    />
);

export default QueuedTasks;
