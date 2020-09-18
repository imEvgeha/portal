import React from 'react';
// import PropTypes from 'prop-types';
import NexusDynamicForm from '../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import schema from './schema.json';

import './RightDetails.scss';

const RightDetails = () => {
    const mockData = {
        rightId: '1234',
        title: 'Some title',
        boolean: 'true',
        rating: {
            ratingSystem: 'system X',
            ratingValue: null,
            ratingReason: null,
        },
    };

    return (
        <div className="nexus-c-right-details">
            <NexusDynamicForm schema={schema} data={mockData} isEdit />
        </div>
    );
};

RightDetails.propTypes = {};

RightDetails.defaultProps = {};

export default RightDetails;
