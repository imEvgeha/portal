import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import {connect} from 'react-redux';
import {
    CHANGE_PRIORITY_TITLE,
    TASK_ACTIONS_ASSIGN,
    TASK_ACTIONS_FORWARD,
    PRIORITY_OPTIONS,
} from '../../../../constants';
import {getDopTasksOwners} from '../../../../dopTasksActions';
import {createTaskOwnersSelector} from '../../../../dopTasksSelectors';
import './AssignModal.scss';

const AssignModal = ({getOwners, selectedTasks, tasksOwners, onChange, action}) => {
    useEffect(() => {
        if (action === TASK_ACTIONS_ASSIGN) {
            getOwners(selectedTasks.map(n => n.id));
        } else if (action === TASK_ACTIONS_FORWARD) {
            getOwners([]);
        }
    }, []);

    return (
        <div className="dop-tasks-assign-tasks">
            <label>{`${action} to: `}</label>
            <Select
                placeholder={`Select ${
                    action === CHANGE_PRIORITY_TITLE
                        ? 'priority'
                        : action === TASK_ACTIONS_ASSIGN
                        ? 'Task Owner'
                        : 'Work Queue'
                }`}
                options={action === CHANGE_PRIORITY_TITLE ? PRIORITY_OPTIONS : tasksOwners}
                onChange={val => onChange(val.value)}
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
};

AssignModal.defaultProps = {
    onChange: () => null,
    selectedTasks: [],
    tasksOwners: [],
    action: TASK_ACTIONS_ASSIGN,
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
