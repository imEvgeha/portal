import React from 'react';
// import PropTypes from 'prop-types';
import NexusDynamicForm from '../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import mapping from './structureMapping.json';
import './RightDetails.scss';

const RightDetails = () => {
    return (
        <div className="nexus-c-right-details">
            <NexusDynamicForm mapping={mapping}/>
        </div>
    );
};

RightDetails.propTypes = {};

RightDetails.defaultProps = {};

export default RightDetails;
