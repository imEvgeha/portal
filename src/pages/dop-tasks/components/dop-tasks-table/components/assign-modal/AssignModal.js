import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import {connect} from 'react-redux';
import {getDopTasksOwners} from '../../../../dopTasksActions';
import {createTaskOwnersSelector} from '../../../../dopTasksSelectors';
import './AssignModal.scss';

const AssignModal = ({getOwners, selectedTasks, tasksOwners, setTaskOwner}) => {
    useEffect(() => {
        getOwners(selectedTasks);
    }, []);

    return (
        <div className="dop-tasks-assign-tasks">
            <Select
                placeholder="Select Task Owner"
                options={tasksOwners.map(({firstName, lastName, userId}) => ({
                    label: `${firstName} ${lastName} (${userId})`,
                    value: userId,
                }))}
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
};

AssignModal.defaultProps = {
    selectedTasks: [],
    tasksOwners: [],
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
