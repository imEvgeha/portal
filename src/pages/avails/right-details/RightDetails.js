import React from 'react';
// import PropTypes from 'prop-types';
import availsConfig from '../../../../profile/availsConfig.json';
import NexusDynamicForm from '../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import NexusForm from '../../../ui/elements/nexus-dynamic-form/components/NexusForm';
import schema from './schema.json';

import './RightDetails.scss';

const RightDetails = () => {
    const mockData = {
        rightId: '1234',
        title: 'Some title',
        rating: {
            ratingSystem: 'system X',
            ratingValue: null,
            ratingReason: null,
        },
    };

    return (
        <div className="nexus-c-right-details">
            {/* <NexusDynamicForm schema={schema} /> */}
            <NexusForm fields={availsConfig} data={mockData} />
        </div>
    );
};

RightDetails.propTypes = {};

RightDetails.defaultProps = {};

export default RightDetails;
