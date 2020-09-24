import React, {memo, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import NexusDynamicForm from '../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import {getRight} from "../rights-repository/rightsActions";
import schema from './schema.json';

import './RightDetails.scss';

const RightDetails = ({getRight}) => {
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

    useEffect(() => {
        getRight({id: 'rght_zrp8g'});
    });

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

RightDetails.propTypes = {
    getRight: PropTypes.func,
};

RightDetails.defaultProps = {
    getRight: () => null,
};

const mapDispatchToProps = dispatch => ({
    getRight: payload => dispatch(getRight(payload)),
});

export default connect(null, mapDispatchToProps)(memo(RightDetails));
