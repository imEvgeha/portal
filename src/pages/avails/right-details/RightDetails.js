import React from 'react';
// import PropTypes from 'prop-types';
import NexusDynamicForm from '../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import schema from './schema.json';
import './RightDetails.scss';

const RightDetails = () => {
    return (
        <div className="nexus-c-right-details">
            <NexusDynamicForm schema={schema}/>
        </div>
    );
};

RightDetails.propTypes = {};

RightDetails.defaultProps = {};

export default RightDetails;
