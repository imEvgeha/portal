import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import {connect} from 'react-redux';
import {TASK_ACTIONS_ASSIGN} from '../../../../constants';
import {getDopTasksOwners} from '../../../../dopTasksActions';
import {createTaskOwnersSelector} from '../../../../dopTasksSelectors';
import './AssignModal.scss';

const AssignModal = ({getOwners, selectedTasks, tasksOwners, setTaskOwner, action}) => {
    useEffect(() => {
        action === TASK_ACTIONS_ASSIGN ? getOwners(selectedTasks) : getOwners([]);
    }, []);

    return (
        <div className="dop-tasks-assign-tasks">
            <label>{`${action} to: `}</label>
            <Select
                placeholder={`Select ${action === TASK_ACTIONS_ASSIGN ? 'Task Owner' : 'Work Queue'}`}
                options={tasksOwners}
                onChange={val => setTaskOwner(val.value)}
            />
        </div>
    );
};

AssignModal.propTypes = {
    getOwners: PropTypes.func.isRequired,
    setTaskOwner: PropTypes.func.isRequired,
    selectedTasks: PropTypes.array,
    tasksOwners: PropTypes.array,
    action: PropTypes.string,
};

AssignModal.defaultProps = {
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
