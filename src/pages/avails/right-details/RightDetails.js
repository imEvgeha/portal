import React, {memo, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/NexusDynamicForm';
import NexusStickyFooter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-sticky-footer/NexusStickyFooter';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {connect} from 'react-redux';
import {getRight, updateRight, clearRight} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import RightDetailsHeader from './components/RightDetailsHeader';
import * as detailsSelectors from './rightDetailsSelector';
import {searchPerson} from './rightDetailsServices';
import schema from './schema.json';
import './RightDetails.scss';

const RightDetails = ({getRight, updateRight, right, match, selectValues, isSaving, clearRight, isFetching}) => {
    const containerRef = useRef();

    useEffect(() => {
        const {params} = match || {};
        if (params.id) {
            getRight({id: params.id});
        }

        return () => {
            clearRight();
        };
    }, []);

    const onSubmit = values => {
        updateRight(values);
    };

    return (
        <div className="nexus-c-right-details">
            <RightDetailsHeader title="Right Details" right={right} containerRef={containerRef} />
            {right?.id && !isFetching && (
                <NexusDynamicForm
                    schema={schema}
                    initialData={right}
                    onSubmit={values => onSubmit(values)}
                    selectValues={selectValues}
                    isSaving={isSaving}
                    containerRef={containerRef}
                    searchPerson={searchPerson}
                    canEdit={!!right?.id}
                />
            )}
            <NexusStickyFooter />
        </div>
    );
};

RightDetails.propTypes = {
    getRight: PropTypes.func,
    updateRight: PropTypes.func,
    right: PropTypes.object,
    match: PropTypes.object,
    clearRight: PropTypes.func,
    selectValues: PropTypes.object,
    isSaving: PropTypes.bool,
    isFetching: PropTypes.bool,
};

RightDetails.defaultProps = {
    getRight: () => null,
    updateRight: () => null,
    clearRight: () => null,
    right: {},
    match: {},
    selectValues: {},
    isSaving: false,
    isFetching: false,
};

const mapStateToProps = () => {
    const rightSelector = selectors.getRightDetailsRightsSelector();
    const loadingSelector = createLoadingSelector(['GET_RIGHT']);

    return (state, props) => ({
        right: rightSelector(state, props),
        selectValues: detailsSelectors.selectValuesSelector(state, props),
        isSaving: detailsSelectors.isSavingSelector(state),
        isFetching: loadingSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    getRight: payload => dispatch(getRight(payload)),
    clearRight: () => dispatch(clearRight()),
    updateRight: payload => dispatch(updateRight(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(RightDetails));
