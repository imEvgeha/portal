import React, {memo, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import NexusDynamicForm from '../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import {getRight, updateRight} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import schema from './schema.json';

import './RightDetails.scss';

const RightDetails = ({getRight, updateRight, right, match}) => {
    useEffect(() => {
        const {params} = match || {};
        if (params.id) {
            getRight({id: params.id});
        }
    }, []);

    const onSubmit = values => {
        console.log(values);
        updateRight(values);
    };

    return (
        <div className="nexus-c-right-details">
            <NexusDynamicForm schema={schema} initialData={right} isEdit onSubmit={values => onSubmit(values)} />
        </div>
    );
};

RightDetails.propTypes = {
    getRight: PropTypes.func,
    updateRight: PropTypes.func,
    right: PropTypes.object,
    match: PropTypes.object,
};

RightDetails.defaultProps = {
    getRight: () => null,
    updateRight: () => null,
    right: {},
    match: {},
};

const mapStateToProps = () => {
    const rightSelector = selectors.getRightDetailsRightsSelector();

    return (state, props) => ({
        right: rightSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    getRight: payload => dispatch(getRight(payload)),
    updateRight: payload => dispatch(updateRight(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(RightDetails));
