import React, {memo, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import NexusDynamicForm from '../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import {getRight, updateRight} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import RightDetailsHeader from './components/RightDetailsHeader';
import * as detailsSelectors from './rightDetailsSelector';
import {searchPerson} from "./rightDetailsServices";
import schema from './schema.json';

import './RightDetails.scss';

const RightDetails = ({getRight, updateRight, right, match, selectValues, history}) => {
    const containerRef = useRef();

    useEffect(() => {
        const {params} = match || {};
        if (params.id) {
            getRight({id: params.id});
        }
    }, []);

    const onSubmit = values => {
        updateRight(values);
    };

    return (
        <div className="nexus-c-right-details">
            <RightDetailsHeader title="Right Details" right={right} history={history} containerRef={containerRef} />
            <NexusDynamicForm
                schema={schema}
                initialData={right}
                isEdit
                onSubmit={values => onSubmit(values)}
                selectValues={selectValues}
                containerRef={containerRef}
                searchPerson={searchPerson}
            />
        </div>
    );
};

RightDetails.propTypes = {
    getRight: PropTypes.func,
    updateRight: PropTypes.func,
    right: PropTypes.object,
    match: PropTypes.object,
    selectValues: PropTypes.object,
    history: PropTypes.object,
};

RightDetails.defaultProps = {
    getRight: () => null,
    updateRight: () => null,
    right: {},
    match: {},
    selectValues: {},
    history: {},
};

const mapStateToProps = () => {
    const rightSelector = selectors.getRightDetailsRightsSelector();

    return (state, props) => ({
        right: rightSelector(state, props),
        selectValues: detailsSelectors.selectValuesSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    getRight: payload => dispatch(getRight(payload)),
    updateRight: payload => dispatch(updateRight(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(RightDetails));
