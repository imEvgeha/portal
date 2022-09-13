import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from '@portal/portal-components';
import {connect} from 'react-redux';
import {
    CHANGE_PRIORITY_TITLE,
    PRIORITY_OPTIONS,
    TASK_ACTIONS_ASSIGN,
    TASK_ACTIONS_FORWARD,
} from '../../../../constants';
import {getDopTasksOwners} from '../../../../dopTasksActions';
import {createTaskOwnersSelector} from '../../../../dopTasksSelectors';
import './AssignModal.scss';

const AssignModal = ({getOwners, selectedTasks, tasksOwners, onChange, value, action}) => {
    const [selectedValue, setSelectedValue] = useState(value);
    useEffect(() => {
        if (action === TASK_ACTIONS_ASSIGN) {
            getOwners(selectedTasks.map(n => n.id));
        } else if (action === TASK_ACTIONS_FORWARD) {
            getOwners([]);
        }
    }, []);

    return (
        <div className="dop-tasks-assign-tasks">
            <Dropdown
                labelProps={{
                    label: `${action} to: `,
                    shouldUpper: false,
                    stacked: true,
                }}
                id="ddlAssignTo"
                placeholder={`Select ${
                    action === CHANGE_PRIORITY_TITLE
                        ? 'priority'
                        : action === TASK_ACTIONS_ASSIGN
                        ? 'Task Owner'
                        : 'Work Queue'
                }`}
                value={selectedValue}
                options={action === CHANGE_PRIORITY_TITLE ? PRIORITY_OPTIONS : tasksOwners}
                onChange={e => {
                    onChange(e.value);
                    setSelectedValue(e.value);
                }}
            />
        </div>
    );
};

AssignModal.propTypes = {
    getOwners: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    selectedTasks: PropTypes.array,
    tasksOwners: PropTypes.array,
    action: PropTypes.string,
    value: PropTypes.string,
};

AssignModal.defaultProps = {
    onChange: () => null,
    selectedTasks: [],
    tasksOwners: [],
    action: TASK_ACTIONS_ASSIGN,
    value: '',
};

const mapStateToProps = () => {
    const ownersSelector = createTaskOwnersSelector();
    return state => ({
        tasksOwners: ownersSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    getOwners: payload => dispatch(getDopTasksOwners(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssignModal);
