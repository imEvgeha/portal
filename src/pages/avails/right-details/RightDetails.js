import React from 'react';
// import PropTypes from 'prop-types';
import NexusDynamicForm from '../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import {VIEWS} from '../../../ui/elements/nexus-dynamic-form/constants';
import schema from './schema.json';

import './RightDetails.scss';

const RightDetails = () => {
    const mockData = {
        title:
            "Some title Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        boolean: true,
        coreTitleId: 12,
        rating: {
            ratingSystem: 'system X',
            ratingValue: null,
            ratingReason: null,
        },
    };

    // update form data

    return (
        <div className="nexus-c-right-details">
            <NexusDynamicForm
                schema={schema}
                data={mockData}
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
