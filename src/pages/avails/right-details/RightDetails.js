import React from 'react';
// import PropTypes from 'prop-types';
import NexusDynamicForm from '../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import schema from './schema.json';

import './RightDetails.scss';

const RightDetails = () => {
    const mockData = {
        rightId: '123',
        title: 'Some title Lorem Ipsum is simply dummy text of ',
        boolean: true,
        coreTitleId: 12,
        rating: {
            ratingSystem: 'system X',
            ratingValue: null,
            ratingReason: null,
        },
        territory: [
            {
                country: 'GB',
                selected: false,
                dateSelected: null,
                rightContractStatus: 'Pending',
                vuContractId: [],
                hide: null,
                comment: null,
                dateWithdrawn: null,
            },
        ],
    };

    // update form data

    return (
        <div className="nexus-c-right-details">
            <NexusDynamicForm
                schema={schema}
                initialData={mockData}
                isEdit
                // isEdit={false}
                onSubmit={values => console.log(values)}
            />
        </div>
    );
};

RightDetails.propTypes = {};

RightDetails.defaultProps = {};

export default RightDetails;
